const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserPost = new Schema({  
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true     
  },
  email:{
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  is_admin:{    
    type: Boolean,
    default: 0
  }
}, {timestamps: true})

module.exports = mongoose.model('User', UserPost);


