const router   = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const ctrl     = require('../controllers/uploadsController');

router.post('/presign',
  auth,
  [
    body('filename').notEmpty().withMessage('Filename required'),
    body('contentType').notEmpty().withMessage('Content type required'),
  ],
  validate,
  ctrl.presign
);

module.exports = router;
