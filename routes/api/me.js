const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Recipe = require('../../models/Recipe');
const User = require('../../models/User');

router.get('/', auth, async (req, res) => {
    try {
    // get user from database
    const user = await User.findById(req.user.id).exec()
    // find recipes from DB for particular user
    const recipes = await Recipe.find({ user: user })
    
    res.render('me', { firstName: user.firstName, lastName: user.lastName, recipes: recipes, auth: true });
    
    } catch (err) {
      console.log(err);
    }

});

router.post('/delete', auth, async (req, res) => {
  try {
  // get user from database
  const user = await User.findById(req.user.id).exec()
  // get recipe id from req.body
  const { recipeId } = req.body;
  
  await Recipe.deleteOne({_id: recipeId});
  req.flash('info', 'Recipe deleted from your favorite');
  res.redirect('/api/me');
  
  } catch (err) {
    console.log(err);
  }

});

module.exports = router;