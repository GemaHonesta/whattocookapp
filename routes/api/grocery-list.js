const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const GroceryItem = require('../../models/GroceryList');
const User = require('../../models/User');

router.get('/', auth, async (req, res) => {
  try {
  // get user from database
  const user = await User.findById(req.user.id).exec()
  // find shopItem from DB for particular user
  const shopItems = await GroceryItem.find({ user: user })
  
  res.render('groceryList', { firstName: user.firstName, lastName: user.lastName, items: shopItems, auth: true });
  
  } catch (err) {
    console.log(err);
  }

});

router.post('/add', auth, async (req, res) => {
  try {
    // get user from database
    const user = await User.findById(req.user.id).exec()

    const { shopItem } = req.body;

    // get info from saving recipe
    const addShopItem = new GroceryItem({
      user: user._id,
      itemName: shopItem
    });

    await addShopItem.save();
    req.flash('info', 'Item-shop saved successfully');
    res.redirect('/api/grocery-list');
  
  } catch (err) {
    console.log(err);
  }

});

router.post('/update', auth, async (req, res) => {
  try {
    const { updateShopItem,  idShopItem } = req.body;
    console.log(updateShopItem, idShopItem);
    // get shopItem from database and update it
    await GroceryItem.findByIdAndUpdate({_id: idShopItem}, {itemName: updateShopItem}, {upsert: true});
    req.flash('info', 'Item-shop updated');
    res.redirect('/api/grocery-list');    
  
  } catch (err) {
    console.log(err);
  }

});

router.post('/delete', auth, async (req, res) => {
  try {
    const { idShopItem } = req.body
    await GroceryItem.deleteOne({_id: idShopItem});
    req.flash('info', 'Item-shop deleted');
    res.redirect('/api/grocery-list');
  } catch (err) {
    console.log(err);
  }

});

module.exports = router;