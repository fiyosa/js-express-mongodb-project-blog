const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

const dateIndonesia = moment.tz(Date.now(), "Asia/Jakarta");

const BlogPost = new Schema({
  _id: Schema.Types.ObjectId,
  user_id:{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }, 
  category_id:{
    type: Schema.Types.ObjectId, 
    ref: 'Category'
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  excerpt:{
    type: String,
    required: true    
  },
  body:{
    type: String,
    required: true    
  },
  image:{
    type: String,
    required: false
  },
  published_at:{
    type: Date,
    default: dateIndonesia
  }
}, {timestamps: true})

module.exports = mongoose.model('Blog', BlogPost);


