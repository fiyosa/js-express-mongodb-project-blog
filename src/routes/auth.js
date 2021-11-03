const express = require('express');
const {body, param, query} = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/:id', authController.get);
router.get('/', authController.getAll);

router.post('/validate', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalid'),
  body('password')
    .isLength({min: 10})
    .withMessage('Password invalid')  
], authController.validate);

router.post('/', [
  body('name')
    .isLength({min: 3})
    .withMessage('Name invalid'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalid'),
  body('password')
    .isLength({min: 10})
    .withMessage('Password invalid')  
], authController.register);

router.patch('/:id', [
  param('id')
    .notEmpty()
    .withMessage('ID Invalid'),
  body('name')
    .isLength({min: 3})
    .withMessage('Name invalid'),
  body('password')
    .isLength({min: 10})
    .withMessage('Password invalid')  
], authController.update);

router.delete('/:id', [
  param('id')
    .notEmpty()
    .withMessage('ID Invalid')
], authController.delete);

module.exports = router;


