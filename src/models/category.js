const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoryPost = new Schema({  
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true     
  },
  slug:{
    type: String,
    unique: true,
    required: true
  }
}, {timestamps: true})

module.exports = mongoose.model('Category', CategoryPost);


