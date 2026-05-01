const router  = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/historicalProjectController');

router.use(authenticate);
router.get('/',                ctrl.list);
router.post('/',               ctrl.create);
router.put('/:id',             ctrl.update);
router.delete('/:id',          ctrl.remove);
router.post('/:id/document',   ctrl.uploadDocument);

module.exports = router;
