const mongoose = require('mongoose');
const User = require('./User');

const RecipeSchema = new mongoose.Schema({
    recipeName: {
      type: String
    },
    recipeImage: {
      type: String
    },
    recipeUrl: {
      type: String
    },
    recipeIngredients: {
      type: String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true
  }
}, { collection: 'Recipes', timestamps: true });

module.exports = Recipe = mongoose.model('Recipe', RecipeSchema);