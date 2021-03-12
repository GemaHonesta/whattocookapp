const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const fetch = require('node-fetch');

const Food = require('../../models/Food');
const Recipe = require('../../models/Recipe');
const User = require('../../models/User');

router.get('/', auth, async (req, res) => {
    try {
    // get all list food
    const allFood = await Food.find({}, (err, result) => {
      return result;
    }).exec();

    // get user from database
    const user = await User.findById(req.user.id).exec()
    
    // sort fod by category
    const seaFood = allFood.filter(el => el.group === 'Sea food');
    const fruits = allFood.filter(el => el.group === 'Fruits');
    const vegetables = allFood.filter(el => el.group === 'Vegetables');
    const meat = allFood.filter(el => el.group === 'Meat');
    const cereal = allFood.filter(el => el.group === 'Cereals and cereal products');
    const desert = allFood.filter(el => el.group === 'Confectioneries');
    const baking = allFood.filter(el => el.group === 'Baking goods');
    const milk = allFood.filter(el => el.group === 'Milk and milk products');
    const herbs = allFood.filter(el => el.group === 'Herbs and Spices');

    // get default recipes from api
    const response = await fetch(`https://api.edamam.com/search?q=apple&ingr=9&app_id=82c09b1e&app_key=d8f065d4855fcd4c77b511e9870360f6&from=0&to=5`)
    const data = await response.json();
    const recipes = data.hits;
    
    res.render('home', {firstName: user.firstName, lastName: user.lastName, fish: seaFood, fruits: fruits, vegetables: vegetables,
                        meat: meat, cereal: cereal, desert: desert, baking: baking,
                        milk: milk, herbs: herbs, recipes: recipes, count: 0, auth: true});
    
    } catch (err) {
      console.log(err);
    }

});

router.post('/find', auth, async(req, res) => {
  try {
    // get user from database
    const user = await User.findById(req.user.id).exec()

    // get all list food
    const allFood = await Food.find({}, (err, result) => {
      return result;
    }).exec();
    
    // sort fod by category
    const seaFood = allFood.filter(el => el.group === 'Sea food');
    const fruits = allFood.filter(el => el.group === 'Fruits');
    const vegetables = allFood.filter(el => el.group === 'Vegetables');
    const meat = allFood.filter(el => el.group === 'Meat');
    const cereal = allFood.filter(el => el.group === 'Cereals and cereal products');
    const desert = allFood.filter(el => el.group === 'Confectioneries');
    const baking = allFood.filter(el => el.group === 'Baking goods');
    const milk = allFood.filter(el => el.group === 'Milk and milk products');
    const herbs = allFood.filter(el => el.group === 'Herbs and Spices');
    
    // get recipes from api with request from user
    const { searchItem } = req.body;
    const response = await fetch(`https://api.edamam.com/search?q=${searchItem}&app_id=82c09b1e&app_key=d8f065d4855fcd4c77b511e9870360f6&from=0&to=10`)
    const data = await response.json();
    const recipesFromSearch = data.hits;
    const count = recipesFromSearch.length;
    
    res.render('home', {firstName: user.firstName, lastName: user.lastName, fish: seaFood, fruits: fruits, vegetables: vegetables,
                        meat: meat, cereal: cereal, desert: desert, baking: baking,
                        milk: milk, herbs: herbs, recipes: recipesFromSearch, count: count, auth: true });

  } catch (error) {
    console.log(error);
  }
});

router.post('/save', auth, async(req, res) => {
  try {
    // get user from database
    const user = await User.findById(req.user.id).exec()

    const { recipeName, recipeImage, recipeUrl, recipeIngredients } = req.body;

    // get info from saving recipe
    const saveRecipe = new Recipe({
      user: user._id,
      recipeName,
      recipeImage,
      recipeUrl,
      recipeIngredients
    });

    await saveRecipe.save();

    req.flash('info', 'Recipe saved successfully');
    return res.redirect('/api/home');

  } catch (error) {
    console.log(error);
  }
});

module.exports = router;