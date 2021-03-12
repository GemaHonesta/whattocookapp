const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    food_name: {
    type: String
    },
    scientific_name: {
      type: String
    },
    group: {
      type: String
    },
    sub_group: {
      type: String
    }
}, { collection: 'Foods', timestamps: true });

module.exports = Food = mongoose.model('Food', FoodSchema);