const router   = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const ctrl     = require('../controllers/messagesController');

router.use(auth);

router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getOne);

router.put('/:id/status',
  [body('status').isIn(['new', 'pending', 'replied']).withMessage('Invalid status')],
  validate,
  ctrl.updateStatus
);

router.delete('/:id', ctrl.remove);

module.exports = router;
