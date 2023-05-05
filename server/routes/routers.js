var express = require('express');
var router = express.Router();
var UserController = require('../controllers/userController')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// Sign Up
router.post('/api/signup',UserController.signup_post )
module.exports = router;
