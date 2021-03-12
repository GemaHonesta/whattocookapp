const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwtoken = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');

const User = require('../../models/User');

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/html');
    res.render('login', {auth: false});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');   
  }
});

router.post('/', urlencodedParser, [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required ').exists(),
  ],
async (req, res) => {
  
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
     return res.status(400).json({errors: errors.array()})
  }
  const { email, password } = req.body;

  try {
    // See if user exist
    let user = await User.findOne({ email });
    if(!user) {
      return res.render('error', {msg: 'Invalid email', auth: false});
    }

    // Match the password
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      return res.render('error', {msg: 'Invalid password', auth: false});
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      }
    };

    const token = jwtoken.sign(
      payload,
      config.get('tokenSecret'),
      { expiresIn: '1 day' }
      );

    return res.cookie('token_cookie', token).redirect('/api/home');

  } catch (err) {
    console.error(err.message);
    return res.render('error', {msg: 'Server error', auth: false});
  }  
});



module.exports = router;