const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const {
  getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice,
  addPayment, deletePayment, generatePDF,
} = require('../controllers/invoiceController');

router.use(authenticate);

router.get('/', getInvoices);
router.get('/:id', getInvoice);
router.get('/:id/pdf', generatePDF);
router.post('/', authorize('admin', 'qs', 'project_manager'), createInvoice);
router.put('/:id', authorize('admin', 'qs', 'project_manager'), updateInvoice);
router.delete('/:id', authorize('admin'), deleteInvoice);

// Payment sub-routes
router.post('/:id/payments', authorize('admin', 'qs', 'project_manager'), addPayment);
router.delete('/:id/payments/:paymentId', authorize('admin', 'qs'), deletePayment);

module.exports = router;
