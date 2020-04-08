const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Event = new Schema({
  title: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  allDay: {
    type: Boolean,
    required: false,
    default: false,
  },
  location:  {
    type: String,
    required: false,
    default: ''
  },
  invitees: {
    type: [String],
    required: false,
    default: ['']
  },
  notes: {
    type: String,
    required: false,
    default: ''
  }
},  {timestamps: true})

module.exports = mongoose.model('Event', Event);