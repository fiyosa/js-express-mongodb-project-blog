const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const path = require('path');
const fs = require('fs');
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

const removeImage = (filePath) => {
  filePath = path.join(__dirname, '../../', filePath);
  // console.log(filePath);
  fs.unlink(filePath, err => {
    if(err)console.log(err);
  })
}

exports.getSlug = (req, res, next) => {
  try{
    cekValidate(req);

    const slug = req.params.slug;

    Blog.find({slug})
      .populate({path: 'user_id', select: 'name is_admin'})
      .populate({path: 'category_id', select: 'name slug'})
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

exports.get = (req, res, next) => {
  try{
    cekValidate(req);

    const id = req.params.id;
    const currentPage = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 7;
    let totalItems;

    Blog.find({user_id: id})
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Blog.find({user_id: id})
          .populate({path: 'user_id', select: 'name is_admin'})
          .populate({path: 'category_id', select: 'name slug'})
          .sort({_id:-1})
          .skip((currentPage - 1) * perPage)
          .limit(perPage)
      })
      .then(result => {
        res.status(200).json({
          message: result,
          total_data: totalItems,
          current_page: currentPage,
          per_page: perPage
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

    const currentPage = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 7;
    let totalItems;

    Blog.find()
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Blog.find()
          .populate({path: 'user_id', select: 'name is_admin'})
          .populate({path: 'category_id', select: 'name slug'})
          .sort({_id:-1})
          .skip((currentPage - 1) * perPage)
          .limit(perPage)
      })
      .then(result => {
        res.status(200).json({
          message: result,
          total_data: totalItems,
          current_page: currentPage,
          per_page: perPage
        })
      })
      .catch(err => next(err))

  }catch(err){
    errorResult(502, err);
  }
}

exports.getCategory = (req, res, next) => {
  try{
    cekValidate(req);

    const {search, user_id, category_id} = req.query;
    const currentPage = req.query.Page || 1; 
    const perPage = req.query.perPage || 7; 
    let totalItems;

    let select = {};
    if(user_id) select.user_id = user_id;
    if(category_id) select.category_id = category_id;
    if(search){
      const searchRgx = new RegExp(search, 'i');
      select.body = { $regex: searchRgx};     
    }
    
    if(!select){
      res.status(200).json({
        message: [],
        total_data: 0,
        current_page: currentPage,
        per_page: perPage
      })
      return;
    }

    Blog.find(select)
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Blog.find(select)
          .populate({path: 'user_id', select: 'name is_admin'})
          .populate({path: 'category_id', select: 'name slug'})
          .sort({_id:-1})
          .skip((currentPage - 1) * perPage)
          .limit(perPage)
      })
      .then(result => {
        res.status(200).json({
          message: result,
          total_data: totalItems,
          current_page: currentPage,
          per_page: perPage
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

    const user_id = req.body.user_id;
    const category_id = req.body.category_id; 
    const title = req.body.title; 
    const slug = req.body.slug; 
    const excerpt = req.body.excerpt || ''; 
    const body = req.body.body || '';

    let createBlogImage;
    if(req.file){
      const image = req.file.path;
      createBlogImage = {
        _id: new mongoose.Types.ObjectId(),
        user_id, category_id, title, slug, excerpt, body, image
      };
    }
    else{
      createBlogImage = {
        _id: new mongoose.Types.ObjectId(),
        user_id, category_id, title, slug, excerpt, body, image:""
      };
    }

    const createBlog = new Blog(createBlogImage);
    createBlog.save()
      .then(result => {
        res.status(201).json({
          message: 'Create blog successfull'
        }) 
      })
      .catch(err => {
        if(req.file){
          removeImage(req.file.path);
        }
        next(err);
      })
  }catch(err){
    if(req.file){
      removeImage(req.file.path);
    }
    errorResult(502, err);
  }
}

exports.update = (req, res, next) => {
  try{
    cekValidate(req);

    
    const slug = req.params.slug;
    const category_id = req.body.category_id;
    const title = req.body.title; 
    const excerpt = req.body.excerpt; 
    const body = req.body.body;
    
    let updateBlog;
    if(req.file){
      const image = req.file.path;
      updateBlog = {
        title, category_id, excerpt, body, image
      };
    }
    else{
      updateBlog = {
        title, category_id, excerpt, body
      };
    }

    Blog.find({slug})
      .then(result => {
        const pathImage = result[0].image;
        if(req.file && pathImage){
          removeImage(pathImage);
        }
        return Blog.updateOne({slug}, updateBlog)
      })
      .then(result => {
        res.status(200).json({
          message: "Blog has been upadated"
        }) 
      })
      .catch(err => {
        next(err);
      })

    
  }catch(err){
    errorResult(502, err);
  }
}

exports.delete = (req, res, next) => {
  try{
    cekValidate(req);

    const slug = req.params.slug;
    
    Blog.find({slug})
      .then(result => {
        if(!result){
          errorResult(404, "Blog not found");
        }
        if(!result[0].image){
          removeImage(result[0].image);
        }
        return Blog.deleteOne({slug})
      })
      .then(result =>  {
        res.status(200).json({
          message: "Blog has been deleted"
        }) 
      })
      .catch(err => next(err))

  }catch(err){
    errorResult(502, err);
  }
}
