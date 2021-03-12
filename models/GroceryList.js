const mongoose = require('mongoose');
const User = require('./User');

const GroceryItemSchema = new mongoose.Schema({
    itemName: {
      type: String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true
  }
}, { collection: 'GroceryItems', timestamps: true });

module.exports = GroceryItem = mongoose.model('GroceryItem', GroceryItemSchema);