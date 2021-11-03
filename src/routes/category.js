const express = require('express');
const {body, param, query} = require('express-validator');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/:id', categoryController.get)
router.get('/', categoryController.getAll)

router.post('/', [
  body('name')
    .notEmpty()
    .withMessage('Name Invalid'),
  body('slug')
  .notEmpty()
  .withMessage('Slug Invalid')
], categoryController.create);

router.put('/:id', [
  param('id')
    .notEmpty()
    .withMessage('ID Invalid'),
  body('name')
    .notEmpty()
    .withMessage('Name Invalid'),
  body('slug')
    .notEmpty()
    .withMessage('Slug Invalid')
], categoryController.update)

router.delete('/:id', [
  param('id')
    .notEmpty()
    .withMessage('ID Invalid')
], categoryController.delete)

module.exports = router;