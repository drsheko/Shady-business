var express = require("express");
var router = express.Router();
var UserController = require("../controllers/userController");
var CategoryController = require("../controllers/categoryController");
var SubCategoryController = require("../controllers/subCategoryController");
var ProductController = require("../controllers/productController");
var OptionController = require("../controllers/productOptionController");
var BrandController = require("../controllers/brandController");
var ReviewController = require("../controllers/reviewController");
var CouponController = require("../controllers/couponController");
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
//CREATE A NEW Category
router.post("/api/categories/addCategory", CategoryController.addCategory);
// EDIT CATEGORY BY ID
router.post('/api/categories/edit/category', CategoryController.EDIT_CATEGORY_BY_ID)
// Edit Category PHOTO By Category ID
router.post(
  "/api/categories/editPhoto",
  CategoryController.Edit_Category_photo_BY_ID
);

// Get ALL Categories
router.get("/api/categories/all", CategoryController.All_Categories);
// Get Category By Id
router.post("/api/categories/category", CategoryController.GET_CATEGORY_BY_Id);
// DELETE CATEGORY 
router.post("/api/categories/delete/category", CategoryController.DELETE_CATEGORY_BY_ID)


//-------------------SUB-CATEGORIES------------------------------------

// ADD A SUB-CATEGORY
router.post("/api/subCategories/add/subCategory", SubCategoryController.ADD_SubCatgeory);
// GET ALL SUB-Categories
router.get(
  "/api/subCategories/all",
  SubCategoryController.GET_ALL_SUB_CATEGORIES
);
// EDIT A SUB_CATEGORY
router.post("/api/subCategories/edit/subCategory", SubCategoryController.EDIT_SUB_CATEGORY_BY_ID);

// Get sub-category by id
router.get(
  "/api/subcategories/subcategory/:id",
  SubCategoryController.GET_ONE_BY_Id
);

// ----------------------PRODUCT-----------------------------------------
// Create A Product
router.post("/api/products/addProduct", ProductController.CREATE_PRODUCT);
// EDIT PRODUCT
router.post('/api/products/edit/product', ProductController.EDIT_PRODUCT);
// DELETE ONE PRODUCT 
router.post('/api/products/remove/product', ProductController.DELETE_PRODUCT_BY_ID)
// Get Product By Id
router.get("/api/products/product", ProductController.GET_PRODUCT_By_Id);
router.post("/api/products/edit", ProductController.edit);
router.get('/api/products/all', ProductController.GET_All_PRODUCTS)
//------------------------OPTION----------------------------------
// Create A Product-OPTION
router.post("/api/products/product/addOption", OptionController.CREATE_OPTION);

// -------------------- BRAND --------------------------------
router.post("/api/brands/brand/new", BrandController.Create_BRAND);

// -----------------------REVIEWS----------------------------------------
// create new review
router.post("/api/reviews/review/new", ReviewController.CREATE_Review);

//-------------------------COUPONS------------------------------------
// Create new coupon
router.post("/api/coupons/new/coupon", CouponController.Create_COUPON);
// Edit coupon 
router.post('/api/coupons/edit/coupon',CouponController.Edit_Coupon)
// delete coupon by id
router.post("/api/coupons/remove/coupon", CouponController.REMOVE_COUPON_BY_ID);
//delete MANY COUPONS BY Ids
router.post('/api/coupons/removeMany/coupons', CouponController.Delete_MANY_COUPONS_BY_Id)
// get all coupons
router.get("/api/coupons/all", CouponController.Get_ALL_COUPONS);

module.exports = router;
