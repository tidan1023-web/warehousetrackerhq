const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  boqVersionId: { type: mongoose.Schema.Types.ObjectId, ref: 'BoqVersion', required: true },
  companySnapshot: { type: Object, default: {} },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft',
  },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  currency: { type: String, default: 'NGN' },
  subtotal: { type: Number, default: 0 },
  vatPercent: { type: Number, default: 0, min: 0, max: 100 },
  vatAmount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  amountPaid: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  notes: { type: String },
  sentAt: { type: Date },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

invoiceSchema.pre('save', async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
