const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const Category = require('../models/category');
const Blog = require('../models/blog');
require('dotenv').config();

const cekValidate = req => {
  const errors = validationResult(req);  
  if(!errors.isEmpty()){
    const err = new Error('Invalid Value');
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(process.env.API_TOKEN != token && process.env.API_VERIFY == 1) {
    errorResult(401, 'Your token is invalid')
  }
}

const errorResult = (status = 500, title) => {
  const err = new Error(title);
  err.errorStatus = status;
  throw err;
}

exports.get = (req, res, next) => {
  try{
    cekValidate(req);

    const id = req.params.id;

    Category.findOne({id})
      .then(result => {
        res.status(200).json({
          message: result
        }) 
      })
      .catch(err => next(err))

  }catch(err){
    errorResult(502, err);
  }
}

exports.getAll = (req, res, next) => {
  try{
    cekValidate(req);

    Category.find()
      .sort({name:1})
      .then(result => {
        res.status(200).json({
          message: result
        }) 
      })
      .catch(err => next(err))


  }catch(err){
    errorResult(502, err);
  }
}

exports.create = (req, res, next) => {
  try{
    cekValidate(req);
    
    const name = req.body.name;
    const slug = req.body.slug;
    
    Category.find({slug})
      .then(result => {
        if(result.length){
          errorResult(400, 'Category has been registered');
          console.log('satu');
        }
        const createCategory = new Category({
          _id: new mongoose.Types.ObjectId(),
          name, slug
        });
        createCategory.save()
          .then(result => {
            res.status(201).json({
              message: "Create category successfull"
            })            
          })
          .catch(err => next(err))
      })
      .catch(err => next(err))

    }catch(err){
    errorResult(502, err);
  }
}

exports.update = (req, res, next) => {
  try{
    cekValidate(req);

    const id = req.params.id;
    const name = req.body.name;
    const slug = req.body.slug;
    
    Category.findByIdAndUpdate(id, {name, slug})
      .then(result => {
        res.status(200).json({
          message: "Category has been upadated"
        }) 
      })
      .catch(err => next(err))

  }catch(err){
    errorResult(502, err);
  }
}

exports.delete = (req, res, next) => {
  try{
    cekValidate(req);

    const id = req.params.id;
    Category.deleteOne({id})
      .then(result => {
        Blog.deleteMany({category_id: id})
          .then(result => {
            console.log('Blog has been delete');
          })
          .catch(err => {
            console.log('Blog failed to delete');
          })
        res.status(200).json({
          message: "Category has been deleted"
        })  
      })
      .catch(err => next(err))

  }catch(err){
    errorResult(502, err);
  }
}






