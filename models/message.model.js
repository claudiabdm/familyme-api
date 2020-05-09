const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = require('mongoose').Types.ObjectId;

const Message = new Schema({
  groupId: {
    type: ObjectId,
    required: true
  },
  addedBy: {
    type: String,
    required: true
  },
  userId: {
    type: ObjectId,
    required: true
  },
  text: {
    type: String,
    required: true,
  }
},  {timestamps: {createdAt: true, updatedAt: false}})

module.exports = mongoose.model('Message', Message);