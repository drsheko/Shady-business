var express = require("express");
var router = express.Router();
var ProjectController =require("../controllers/projectController");
var UserController = require("../controllers/userController");
var CategoryController = require("../controllers/categoryController");
var SubCategoryController = require("../controllers/subCategoryController");
var ProductController = require("../controllers/productController");
var OptionController = require("../controllers/productOptionController");
var BrandController = require("../controllers/brandController");
var ReviewController = require("../controllers/reviewController");
var CouponController = require("../controllers/couponController");
var AddressController = require("../controllers/addressController");
var PaymentController = require("../controllers/paymentController");
var OrderController = require("../controllers/orderController");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//----------------USERS-------------------------------------------
// Sign Up
router.post("/api/signup", UserController.signup_post);

// login
router.post("/api/login", UserController.login_post);
// ADMIN LOGIN 
router.post("/api/admin/login", UserController.ADMIN_LOGIN);
// logout
router.get("/api/logout", UserController.log_out);
// Edit USER INFO 
router.post("/api/account/edit/info", UserController.EDIT_USER_INFO);
// Edit USER Password
router.post("/api/account/password/edit" , UserController.changePassword)
router.post("/api/resetpassword/sendcode", UserController.SEND_RESET_PASSWORD_CODE);
router.post("/api/resetpassword/matchcode", UserController.MATCH_RESET_PASSWORD_CODE);
router.post("/api/resetpassword/resetpassword", UserController.RESET_PASSWORD);
// GET ALL USERS 
router.get("/api/users/all", UserController.GET_ALL_USERS);

// UPDATE SHOPPING CART 

router.post("/api/shoppingcart", UserController.UPDATE_CART);
//-------------------CATEGORIES------------------------
//CREATE A NEW Category
router.post("/api/categories/addCategory", CategoryController.addCategory);
// EDIT CATEGORY BY ID
router.post(
  "/api/categories/edit/category",
  CategoryController.EDIT_CATEGORY_BY_ID
);
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
router.post(
  "/api/categories/delete/category",
  CategoryController.DELETE_CATEGORY_BY_ID
);

//-------------------SUB-CATEGORIES------------------------------------

// ADD A SUB-CATEGORY
router.post(
  "/api/subCategories/add/subCategory",
  SubCategoryController.ADD_SubCatgeory
);
// GET ALL SUB-Categories
router.get(
  "/api/subCategories/all",
  SubCategoryController.GET_ALL_SUB_CATEGORIES
);
// EDIT A SUB_CATEGORY
router.post(
  "/api/subCategories/edit/subCategory",
  SubCategoryController.EDIT_SUB_CATEGORY_BY_ID
);
// DELETE SUBCATEGORY
router.post(
  "/api/subCategories/delete/subCategory",
  SubCategoryController.DELETE_SUB_CATEGORY_BY_ID
);
// Get sub-category by id
router.get(
  "/api/subcategories/subcategory/:id",
  SubCategoryController.GET_ONE_BY_Id
);

// ----------------------PRODUCT-----------------------------------------
// Create A Product
router.post("/api/products/addProduct", ProductController.CREATE_PRODUCT);
// EDIT PRODUCT
router.post("/api/products/edit/product", ProductController.EDIT_PRODUCT);
// DELETE ONE PRODUCT
router.post(
  "/api/products/remove/product",
  ProductController.DELETE_PRODUCT_BY_ID
);
// Get Product By Id
router.post("/api/products/product", ProductController.GET_PRODUCT_By_Id);
router.post("/api/products/edit", ProductController.edit);
router.get("/api/products/all", ProductController.GET_All_PRODUCTS);
//------------------------OPTION----------------------------------
// Create A Product-OPTION
router.post("/api/products/product/addOption", OptionController.CREATE_OPTION);

// -------------------- BRAND --------------------------------
// Create new brand
router.post("/api/brands/new/brand", BrandController.Create_BRAND);
// Get all brands 
router.get("/api/brands/all", BrandController.GET_ALL_BRANDS);
// Get BRAND BY ID
router.post("/api/brands/brand", BrandController.GET_BRAND_BY_ID);
// EDIT BRAND 
router.post("/api/brands/edit/brand", BrandController.EDIT_BRAND_BY_ID);
// DELETE ONE BRAND
router.post("/api/brands/delete/onebrand", BrandController.DELETE_ONE_BRAND_BY_ID);
// DELETE MULTIPLE BRANDS 
router.post("/api/brands/delete/multiplebrands", BrandController.DELETE_MULTIPLE_BRANDS)

// -----------------------REVIEWS----------------------------------------
// create new review
router.post("/api/reviews/review/new", ReviewController.CREATE_Review);

//-------------------------COUPONS------------------------------------
// Create new coupon
router.post("/api/coupons/new/coupon", CouponController.Create_COUPON);
// Edit coupon
router.post("/api/coupons/edit/coupon", CouponController.Edit_Coupon);
// delete coupon by id
router.post("/api/coupons/remove/coupon", CouponController.REMOVE_COUPON_BY_ID);
//delete MANY COUPONS BY Ids
router.post(
  "/api/coupons/removeMany/coupons",
  CouponController.Delete_MANY_COUPONS_BY_Id
);
// get all coupons
router.get("/api/coupons/all", CouponController.Get_ALL_COUPONS);
// Get COUPON BY IT'S CODE
router.post("/api/coupons/code/coupon", CouponController.GET_CCOUPON_BY_CODE);

// ########################### ADDRESS ###################################
// Create A NEW ADDRESS
router.post("/api/addresses/create/address", AddressController.Create_ADDRESS);
// Edit Address
router.post("/api/addresses/edit/address", AddressController.EDIT_ADDRESS);
// Delete Address
router.post("/api/addresses/delete/address", AddressController.DELETE_ADDRESS);
//####################### PAYMENTS ########################
//create a new payment
router.post("/api/payments/new/payment", PaymentController.Create_NEW_CARD);

// ##################### ORDER ######################################
// CREATE A NEW ORDER
router.post("/api/orders/new/order", OrderController.CREATE_NEW_ORDER);
// GET ORDERS BY USER ID
router.post("/api/orders/user/all", OrderController.GET_ORDERS_BY_USER_ID);
// GET ALL ORDERS 
router.get("/api/orders/all", OrderController.GET_ALL_ORDERS);
// Get Best Selling products
router.post("/api/orders/bestseller/products", OrderController.BEST_SELLER_PRODUCTS);
router.post("/api/orders/cat", OrderController.GET_CAT_PERCENT);
// Get REvenu && PROFIT
router.post("/api/orders/revenu", OrderController.GET_GROSS_PROFIT);

//###################### Project #######################
// get Project Configuration
router.get("/api/project/configuration", ProjectController.get_Configuration);

// UPDATE PROJECT NAME 
router.post("/api/project/name", ProjectController.EDIT_PROJECT_TITLE);
// UPDATE PROJECT warning banner 
router.post("/api/project/warningbanner", ProjectController.EDIT_PROJECT_Warning_Banner);

// update PROJECT SLIDE SHOW 
router.post("/api/project/slideshow", ProjectController.UPDATE_SLIDE_SHOW);
module.exports = router;
