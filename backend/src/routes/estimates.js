const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/estimateController');

router.use(authenticate);
router.post('/calculate', ctrl.calculate);
router.get('/',           ctrl.list);
router.post('/',          ctrl.create);
router.get('/:id',        ctrl.getOne);
router.put('/:id',        ctrl.update);
router.delete('/:id',     ctrl.remove);
router.get('/:id/pdf',    ctrl.generatePdf);

module.exports = router;
