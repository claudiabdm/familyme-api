const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  name: {
    type:String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  salt: {
    type: String,
  },
  avatar: {
    type: String || ArrayBuffer,
    required: false,
    default: ''
    },
  role: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  familyCode: {
    type: String,
    required: true,
  },
  location: {
    type: Object,
    required: false,
    default: {lat:'', lng:''}
  },
  lastConnection: {
    type: Date,
    default: new Date(),
  }
}, {timestamps: true});

module.exports = mongoose.model('User', User);