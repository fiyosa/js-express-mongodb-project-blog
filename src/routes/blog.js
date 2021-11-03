const express = require('express');
const {body, param, query} = require('express-validator');
const blogController = require('../controllers/blogController');

const router = express.Router();

router.get('/category', blogController.getCategory);
router.get('/', blogController.getAll);
router.get('/:id', blogController.get);
router.get('/slug/:slug', blogController.getSlug);

router.post('/',  [
  body('user_id')
    .isLength({min: 10})
    .withMessage('User invalid'),
  body('category_id')
    .isLength({min: 10})
    .withMessage('Category invalid'),
  body('title')
    .notEmpty()
    .withMessage('Title invalid')
], blogController.create);

router.put('/:slug',  [
  param('slug')
    .notEmpty()
    .withMessage('Slug Invalid'),
  body('category_id')
    .isLength({min: 5})
    .withMessage('Category_id invalid'), 
  body('title')
    .isLength({min: 5})
    .withMessage('Title invalid'), 
  body('excerpt')
    .isLength({min: 5})
    .withMessage('Excerpt invalid'), 
  body('body')
    .isLength({min: 5})
    .withMessage('Body invalid')
], blogController.update);

router.delete('/:slug',  [
  param('slug')
    .notEmpty()
    .withMessage('Slug Invalid')
], blogController.delete);

module.exports = router;
