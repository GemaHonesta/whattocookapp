const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

router.post('/', auth, (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie('token_cookie');
    return res.redirect('/api/auth');
    
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');   
  }
});

module.exports = router;