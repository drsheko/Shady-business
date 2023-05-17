var express = require("express");
var router = express.Router();
var UserController = require("../controllers/userController");
var CategoryController = require("../controllers/categoryController");
var SubCategoryController = require("../controllers/subCategoryController");
var ProductController = require("../controllers/productController");
var OptionController = require("../controllers/productOptionController");
var BrandController =require('../controllers/brandController');

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
//----------------USERS-------------------------------------------
// Sign Up
router.post("/api/signup", UserController.signup_post);

// login
router.post("/api/login", UserController.login_post);

// logout
router.get("/api/logout", UserController.log_out);

//-------------------CATEGORIES------------------------
// Add a Category
router.post("/api/categories/addCategory", CategoryController.addCategory);

// Edit Category PHOTO By Category ID
router.post(
  "/api/categories/editPhoto",
  CategoryController.Edit_Category_photo_BY_ID
);

// Get ALL Categories
router.get("/api/categories/all", CategoryController.All_Categories);

//-------------------SUB-CATEGORIES------------------------------------
// ADD A SUB-CATEGORY
router.post("/api/subCategories/addOne", SubCategoryController.ADD_SubCatgeory);
// GET ALL SUB-Categories
router.get(
  "/api/subCategories/all",
  SubCategoryController.GET_ALL_SUB_CATEGORIES
);

// ----------------------PRODUCT-----------------------------------------
// Create A Product
router.post("/api/products/addProduct", ProductController.CREATE_PRODUCT);
// Get Product By Id
router.get('/api/products/product', ProductController.GET_PRODUCT_By_Id)


//------------------------OPTION----------------------------------
// Create A Product-OPTION
router.post("/api/products/product/addOption", OptionController.CREATE_OPTION);


// -------------------- BRAND --------------------------------
router.post('/api/brands/brand/new', BrandController.Create_BRAND);


module.exports = router;
