const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventModel = require('./event.model');

const Group = new Schema({
  familyCode: {
    type: String,
    default: () => {
      const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const familyCode = [];
      for (let i=0; i < 15; i++) { 
        familyCode.push(charset.charAt(Math.floor(Math.random()*charset.length))); 
      }
      return familyCode.join('');
    }
  },
  name: {
    type: String,
    required: true,
  },
  shoppingList: {
    type: Array,
  },
  events: {
    type: [EventModel.schema],
    required: false,
    default: []
  }
},  {timestamps: true})

module.exports = mongoose.model('Group', Group);