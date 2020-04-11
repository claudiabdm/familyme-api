const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
  name: {
    type: String,
    required: true
  },
  addedBy: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    required: true
  }
},  {timestamps: true})

module.exports = mongoose.model('Product', Product);