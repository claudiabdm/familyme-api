const mongoose = require('mongoose');
const GeoJSON = require('mongoose-geojson-schema');
const Schema = mongoose.Schema;

const EventModel = require('./event.model');
const ProductModel = require('./product.model');
const MessageModel = require('./message.model');

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
    type: [ProductModel.schema],
    required: false,
    default: []
  },
  events: {
    type: [EventModel.schema],
    required: false,
    default: []
  },
  conversation: {
    type: [MessageModel.schema],
    required: false,
    default: []
  },
  savedPlaces: {
    type:  mongoose.Schema.Types.FeatureCollection,
    required: false,
    default: {
      type: 'FeatureCollection',
      features: []
    }
  },
},  {timestamps: true})

module.exports = mongoose.model('Group', Group);