const router        = require('express').Router();
const { body }      = require('express-validator');
const validate      = require('../middleware/validate');
const { auth, adminOnly } = require('../middleware/auth');
const ctrl          = require('../controllers/usersController');

router.use(auth, adminOnly);

router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getOne);

router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password min 8 characters'),
    body('role').optional().isIn(['admin', 'editor']).withMessage('Invalid role'),
  ],
  validate,
  ctrl.create
);

router.put('/:id',
  [
    body('email').optional().isEmail().withMessage('Valid email required'),
    body('role').optional().isIn(['admin', 'editor']).withMessage('Invalid role'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  ],
  validate,
  ctrl.update
);

router.delete('/:id', ctrl.remove);

module.exports = router;
