const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const User = require('../models/user');
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

    User.findOne({id})
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

    const id = req.params.id;

    User.find()
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

exports.validate = (req, res, next) => {
  try{
    cekValidate(req);

    const {email, password} = req.body;

    User.find({email, password})
      .then(result => {
        if(result){
          res.status(200).json({
            message: 'Validate success !!!',
            user_id: result[0]._id,
            user_name: result[0].name,
            user_isAdmin: result[0].is_admin
          }) 
        }
        else errorResult(404, 'Error validate');
      })
      .catch(err => next(err))

  }catch(err){
    errorResult(502, err);
  }
}

exports.register = (req, res, next) => {
  try{
    cekValidate(req);
  
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
  
    User.find({email})
      .then(result => {
        if(!result.length){
          const createUser = new User({
            _id: new mongoose.Types.ObjectId(),
            name, email, password
          });
          createUser.save()
            .then(result => {
              res.status(201).json({
                message: "Create account successfull"
              })            
            })
            .catch(err => next(err))
        }
        else{
          errorResult(400, 'Account has been registered');
        }
      })
      .catch(err => next(err))
  }catch(err){
    errorResult(502, err);
  }
}

exports.update = (req, res, next) => {
  try{
    cekValidate(req);
    
    const id = req.params;
    const body = req.body;
    
    User.findByIdAndUpdate(id, body)
      .then(result => {
        res.status(200).json({
          message: "User has been upadated"
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

    User.find({id})
      .then(result => {
        if(result) {
          errorResult(404, 'Account not found');
        }
        return User.deleteOne({id})
      })
      .then(result => {
        Blog.deleteMany({category_id: id})
          .then(result => {
            console.log('Blog has been delete');
          })
          .catch(err => {
            console.log('Blog failed to delete');
          })
        res.status(200).json({
          message: "Account has been deleted"
        })  
      })
      .catch(err => next(err))

  }catch(err){
    errorResult(502, err);
  }
}


