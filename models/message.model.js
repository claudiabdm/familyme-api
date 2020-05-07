const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserModel = require('./user.model');

const Message = new Schema({
  addedBy: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String || ArrayBuffer,
    required: false,
    default: ''
  },
  text: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
  }
 
},  {timestamps: true})

module.exports = mongoose.model('Message', Message);