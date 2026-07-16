const router   = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl     = require('../controllers/contactController');

router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message too short'),
  ],
  validate,
  ctrl.submit
);

module.exports = router;
