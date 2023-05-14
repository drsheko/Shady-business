var express = require('express');
var router = express.Router();
var UserController = require('../controllers/userController');
var CategoryController = require('../controllers/categoryController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//----------------USERS-------------------------------------------
// Sign Up
router.post('/api/signup',UserController.signup_post )

// login
router.post("/api/login", UserController.login_post);

// logout 
router.get('/api/logout', UserController.log_out);


//-------------------CATEGORIES------------------------
// Add a Category
router.post('/api/categories/addCategory',CategoryController.addCategory);

// Edit Category PHOTO By Category ID
router.post('/api/categories/editPhoto', CategoryController.Edit_Category_photo_BY_ID);

// Get ALL Categories 
router.get('/api/categories/all', CategoryController.All_Categories); 


module.exports = router;
