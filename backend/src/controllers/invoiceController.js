const PDFDocument = require('pdfkit');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const BoqVersion = require('../models/BoqVersion');
const BoqItem = require('../models/BoqItem');
const Approval = require('../models/Approval');
const Company = require('../models/Company');
const Project = require('../models/Project');

// ── helpers ──────────────────────────────────────────────────────────────────

function fmt(n) {
  return Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

async function recalcInvoice(invoice) {
  const payments = await Payment.find({ invoiceId: invoice._id });
  invoice.amountPaid = payments.reduce((s, p) => s + p.amount, 0);
  invoice.balance = Math.max(0, invoice.total - invoice.amountPaid);
  await invoice.save();
  return invoice;
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

exports.getInvoices = async (req, res) => {
  const filter = { companyId: req.user.companyId };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.projectId) filter.projectId = req.query.projectId;

  // Clients only see invoices for projects they are assigned to
  if (req.user.role === 'client') {
    const projects = await Project.find({ companyId: req.user.companyId, assignedClientId: req.user._id }).select('_id');
    filter.projectId = { $in: projects.map((p) => p._id) };
  }

  const invoices = await Invoice.find(filter)
    .populate('projectId', 'name client')
    .populate('boqVersionId', 'name')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });

  res.json({ invoices });
};

exports.getInvoice = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('projectId', 'name client location')
    .populate('boqVersionId', 'name currency')
    .populate('createdBy', 'name');

  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

  const items = await BoqItem.find({ versionId: invoice.boqVersionId });
  const payments = await Payment.find({ invoiceId: invoice._id }).sort({ paymentDate: -1 });

  res.json({ invoice, items, payments });
};

exports.createInvoice = async (req, res) => {
  const { projectId, boqVersionId, vatPercent = 0, dueDate, notes, currency } = req.body;

  const [version, project, company, items] = await Promise.all([
    BoqVersion.findOne({ _id: boqVersionId, companyId: req.user.companyId }),
    Project.findOne({ _id: projectId, companyId: req.user.companyId }),
    Company.findById(req.user.companyId),
    BoqItem.find({ versionId: boqVersionId }),
  ]);

  if (!version) return res.status(404).json({ message: 'BOQ version not found' });
  if (!project) return res.status(404).json({ message: 'Project not found' });

  // Apply client-selected tier costs to items if approvals exist
  const approvals = await Approval.find({ boqVersionId, type: 'item', status: 'approved' });
  const tierMap = {};
  approvals.forEach((a) => { if (a.boqItemId) tierMap[a.boqItemId.toString()] = a.selectedTier; });

  let subtotal = 0;
  const lineItems = items.map((item) => {
    const tier = tierMap[item._id.toString()];
    let baseCost = item.baseCost;
    if (tier && item.options && item.options.length > 0) {
      const opt = item.options.find((o) => o.tier === tier);
      if (opt) baseCost = opt.baseCost;
    }
    const overhead = 1 + item.overheadPercent / 100;
    const profit = 1 + item.profitPercent / 100;
    const unitPrice = parseFloat((baseCost * overhead * profit).toFixed(2));
    const total = parseFloat((unitPrice * item.quantity).toFixed(2));
    subtotal += total;
    return { ...item.toObject(), computedBaseCost: baseCost, computedUnitPrice: unitPrice, computedTotal: total };
  });

  const vatAmount = parseFloat((subtotal * vatPercent / 100).toFixed(2));
  const total = parseFloat((subtotal + vatAmount).toFixed(2));

  const invoice = await Invoice.create({
    projectId,
    boqVersionId,
    companySnapshot: company ? company.toObject() : {},
    vatPercent,
    dueDate,
    notes,
    currency: currency || version.currency || 'NGN',
    subtotal,
    vatAmount,
    total,
    balance: total,
    companyId: req.user.companyId,
    createdBy: req.user._id,
  });

  res.status(201).json({ invoice });
};

exports.updateInvoice = async (req, res) => {
  const { vatPercent, dueDate, notes, status } = req.body;
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

  if (vatPercent !== undefined) {
    invoice.vatPercent = vatPercent;
    invoice.vatAmount = parseFloat((invoice.subtotal * vatPercent / 100).toFixed(2));
    invoice.total = parseFloat((invoice.subtotal + invoice.vatAmount).toFixed(2));
    invoice.balance = Math.max(0, invoice.total - invoice.amountPaid);
  }
  if (dueDate !== undefined) invoice.dueDate = dueDate;
  if (notes !== undefined) invoice.notes = notes;
  if (status !== undefined) {
    invoice.status = status;
    if (status === 'sent' && !invoice.sentAt) invoice.sentAt = new Date();
  }

  await invoice.save();
  res.json({ invoice });
};

exports.deleteInvoice = async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  await Payment.deleteMany({ invoiceId: req.params.id });
  res.json({ message: 'Invoice deleted' });
};

// ── Payments ──────────────────────────────────────────────────────────────────

exports.addPayment = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

  const { amount, method, reference, paymentDate, notes } = req.body;
  const payment = await Payment.create({
    invoiceId: invoice._id,
    amount,
    method,
    reference,
    paymentDate,
    notes,
    recordedBy: req.user._id,
  });

  await recalcInvoice(invoice);

  // Auto-mark paid if fully settled
  if (invoice.balance === 0 && invoice.status !== 'paid') {
    invoice.status = 'paid';
    await invoice.save();
  }

  res.status(201).json({ payment, invoice });
};

exports.deletePayment = async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.paymentId);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });

  const invoice = await Invoice.findById(payment.invoiceId);
  if (invoice) {
    await recalcInvoice(invoice);
    if (invoice.status === 'paid' && invoice.balance > 0) {
      invoice.status = 'sent';
      await invoice.save();
    }
  }
  res.json({ message: 'Payment deleted' });
};

// ── PDF Generation ─────────────────────────────────────────────────────────────

exports.generatePDF = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('projectId', 'name client location')
    .populate('boqVersionId', 'name');
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

  const [items, payments] = await Promise.all([
    BoqItem.find({ versionId: invoice.boqVersionId }),
    Payment.find({ invoiceId: invoice._id }).sort({ paymentDate: 1 }),
  ]);

  const co = invoice.companySnapshot || {};
  const proj = invoice.projectId || {};
  const PRIMARY = '#1e3a8a';
  const LIGHT_BLUE = '#dbeafe';
  const GRAY = '#4b5563';
  const LIGHT_GRAY = '#f3f4f6';

  const doc = new PDFDocument({ size: 'A4', margin: 0 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
  doc.pipe(res);

  const W = doc.page.width;
  const M = 50;

  // ── Header band ──────────────────────────────────────────────────────────────
  doc.rect(0, 0, W, 130).fill(PRIMARY);

  doc.font('Helvetica-Bold').fontSize(22).fillColor('white')
    .text(co.companyName || 'Company Name', M, 30, { width: 280 });

  doc.font('Helvetica').fontSize(9).fillColor(LIGHT_BLUE)
    .text([co.address, co.phone, co.email].filter(Boolean).join('  ·  '), M, 62, { width: 280 });

  if (co.cacNumber) {
    doc.text(`CAC: ${co.cacNumber}`, M, 76, { width: 280 });
  }

  // INVOICE title — right side
  doc.font('Helvetica-Bold').fontSize(32).fillColor('white')
    .text('INVOICE', M, 28, { width: W - M * 2, align: 'right' });

  doc.font('Helvetica').fontSize(9).fillColor(LIGHT_BLUE)
    .text(`#${invoice.invoiceNumber}`, M, 70, { width: W - M * 2, align: 'right' })
    .text(`Issued: ${fmtDate(invoice.issueDate)}`, M, 84, { width: W - M * 2, align: 'right' })
    .text(`Due: ${fmtDate(invoice.dueDate)}`, M, 98, { width: W - M * 2, align: 'right' });

  // ── Status badge ─────────────────────────────────────────────────────────────
  const statusColors = { draft: '#6b7280', sent: '#2563eb', paid: '#16a34a', overdue: '#dc2626', cancelled: '#9ca3af' };
  const badgeColor = statusColors[invoice.status] || '#6b7280';
  doc.roundedRect(W - M - 70, 108, 70, 16, 4).fill(badgeColor);
  doc.font('Helvetica-Bold').fontSize(8).fillColor('white')
    .text(invoice.status.toUpperCase(), W - M - 70, 112, { width: 70, align: 'center' });

  let y = 145;

  // ── Bill To / Project details ─────────────────────────────────────────────
  doc.font('Helvetica-Bold').fontSize(9).fillColor(GRAY)
    .text('BILL TO', M, y)
    .text('PROJECT', W / 2, y);

  y += 14;
  doc.font('Helvetica').fontSize(10).fillColor('#111827')
    .text(proj.client || '—', M, y, { width: 220 })
    .font('Helvetica-Bold').text(proj.name || '—', W / 2, y, { width: 220 })
    .font('Helvetica').fontSize(9).fillColor(GRAY)
    .text(proj.location || '', W / 2, y + 13, { width: 220 });

  y += 38;

  // ── Items table ───────────────────────────────────────────────────────────────
  const colWidths = [220, 50, 55, 80, 55, 80]; // item, unit, qty, base, OH+P%, total
  const colX = [M];
  colWidths.forEach((w, i) => { if (i > 0) colX.push(colX[i - 1] + colWidths[i - 1]); });
  const headers = ['Description', 'Unit', 'Qty', 'Base Cost', 'OH+P%', 'Total'];

  // Table header
  doc.rect(M, y, W - M * 2, 18).fill(PRIMARY);
  doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
  headers.forEach((h, i) => {
    const align = i > 0 ? 'right' : 'left';
    doc.text(h, colX[i] + 3, y + 5, { width: colWidths[i] - 6, align });
  });
  y += 18;

  doc.font('Helvetica').fontSize(8).fillColor('#111827');
  items.forEach((item, idx) => {
    const rowH = 20;
    if (idx % 2 === 1) doc.rect(M, y, W - M * 2, rowH).fill(LIGHT_GRAY);
    const ohp = ((item.overheadPercent || 0) + (item.profitPercent || 0)).toFixed(0);
    const cells = [
      item.item + (item.description ? `\n${item.description}` : ''),
      item.unit,
      String(item.quantity),
      fmt(item.baseCost),
      `${ohp}%`,
      fmt(item.totalCost),
    ];
    cells.forEach((cell, i) => {
      const align = i > 0 ? 'right' : 'left';
      doc.fillColor('#111827').text(cell, colX[i] + 3, y + 4, { width: colWidths[i] - 6, align });
    });
    y += rowH;
  });

  // ── Totals ────────────────────────────────────────────────────────────────────
  y += 8;
  const totalsX = W / 2;
  const totalsW = W - M - totalsX;

  const drawTotal = (label, value, bold = false) => {
    if (bold) {
      doc.rect(totalsX, y - 2, totalsW, 20).fill(PRIMARY);
      doc.font('Helvetica-Bold').fontSize(10).fillColor('white')
        .text(label, totalsX + 5, y + 2, { width: totalsW / 2 - 5 })
        .text(`${invoice.currency} ${value}`, totalsX + totalsW / 2, y + 2, { width: totalsW / 2 - 5, align: 'right' });
      y += 20;
    } else {
      doc.font('Helvetica').fontSize(9).fillColor(GRAY)
        .text(label, totalsX + 5, y, { width: totalsW / 2 - 5 });
      doc.fillColor('#111827')
        .text(`${invoice.currency} ${value}`, totalsX + totalsW / 2, y, { width: totalsW / 2 - 5, align: 'right' });
      y += 16;
    }
  };

  drawTotal('Subtotal', fmt(invoice.subtotal));
  if (invoice.vatPercent > 0) drawTotal(`VAT (${invoice.vatPercent}%)`, fmt(invoice.vatAmount));
  drawTotal('GRAND TOTAL', fmt(invoice.total), true);
  y += 4;
  drawTotal('Amount Paid', fmt(invoice.amountPaid));
  drawTotal('Balance Due', fmt(invoice.balance));

  // ── Bank details ──────────────────────────────────────────────────────────────
  if (co.bankDetails && co.bankDetails.length > 0) {
    y += 16;
    doc.rect(M, y, W - M * 2, 1).fill(LIGHT_BLUE);
    y += 8;
    doc.font('Helvetica-Bold').fontSize(9).fillColor(PRIMARY).text('PAYMENT DETAILS', M, y);
    y += 14;
    co.bankDetails.forEach((bank) => {
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#111827')
        .text(`${bank.bankName || 'Bank'}`, M, y);
      doc.font('Helvetica').fillColor(GRAY)
        .text(`${bank.accountName}  ·  ${bank.accountNumber}${bank.sortCode ? `  ·  Sort: ${bank.sortCode}` : ''}`, M, y + 12, { width: W - M * 2 });
      y += 28;
    });
  }

  if (co.paymentInstructions) {
    doc.font('Helvetica').fontSize(8).fillColor(GRAY).text(co.paymentInstructions, M, y, { width: W - M * 2 });
    y += doc.heightOfString(co.paymentInstructions, { width: W - M * 2 }) + 8;
  }

  // ── Payments recorded ─────────────────────────────────────────────────────────
  if (payments.length > 0) {
    y += 8;
    doc.font('Helvetica-Bold').fontSize(9).fillColor(PRIMARY).text('PAYMENTS RECEIVED', M, y);
    y += 14;
    payments.forEach((p) => {
      doc.font('Helvetica').fontSize(8).fillColor('#111827')
        .text(`${fmtDate(p.paymentDate)}  ·  ${p.method.replace('_', ' ')}${p.reference ? `  ·  Ref: ${p.reference}` : ''}`, M, y, { width: 350 })
        .text(`${invoice.currency} ${fmt(p.amount)}`, M, y, { width: W - M * 2, align: 'right' });
      y += 14;
    });
  }

  if (invoice.notes) {
    y += 10;
    doc.font('Helvetica-Bold').fontSize(9).fillColor(PRIMARY).text('NOTES', M, y);
    y += 12;
    doc.font('Helvetica').fontSize(8.5).fillColor(GRAY).text(invoice.notes, M, y, { width: W - M * 2 });
    y += doc.heightOfString(invoice.notes, { width: W - M * 2 }) + 8;
  }

  // ── Footer ────────────────────────────────────────────────────────────────────
  doc.rect(0, doc.page.height - 45, W, 45).fill(PRIMARY);
  doc.font('Helvetica').fontSize(8).fillColor(LIGHT_BLUE)
    .text(
      `${co.companyName || ''}  ·  Generated ${fmtDate(new Date())}  ·  ${invoice.invoiceNumber}`,
      M, doc.page.height - 28, { width: W - M * 2, align: 'center' }
    );

  doc.end();
};
