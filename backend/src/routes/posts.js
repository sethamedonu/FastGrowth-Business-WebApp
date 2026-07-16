const router   = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const ctrl     = require('../controllers/postsController');

// Public — list published posts
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);

// Protected
router.post('/',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('status').optional().isIn(['draft', 'published']).withMessage('Invalid status'),
  ],
  validate,
  ctrl.create
);

router.put('/:id',
  auth,
  [
    body('status').optional().isIn(['draft', 'published']).withMessage('Invalid status'),
  ],
  validate,
  ctrl.update
);

router.delete('/:id', auth, ctrl.remove);

module.exports = router;
