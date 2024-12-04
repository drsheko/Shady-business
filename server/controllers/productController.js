var Product = require("../models/productModel");
var Option = require("../models/productOption");
var Category = require("../models/categoryModel");
var SubCategory = require("../models/sub_categoryModel");
var Review =require('../models/reviewModel');
const multer = require("multer");
const { ref, uploadBytes, deleteObject } = require("firebase/storage");
const storage = require("../firebase");
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

//CREATE PRODUCT
exports.CREATE_PRODUCT = [
  upload.any("photos"),
  async (req, res) => {
    const isNameTaken = await Product.findOne({ name: req.body.name });
    if (isNameTaken != null) {
      return res.status(401).json({
        success: false,
        error: "This Product is already in Database",
      });
    }
    var uploadedFileURL = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      if (file) {
        const fileName = file.originalname + new Date();
        const imageRef = ref(storage, fileName);
        const metatype = {
          contentType: file.mimetype,
          name: file.originalname,
        };
        await uploadBytes(imageRef, file.buffer, metatype)
          .then((snapshot) => {
            uploadedFileURL.push(
              `https://firebasestorage.googleapis.com/v0/b/${snapshot.ref._location.bucket}/o/${snapshot.ref._location.path_}?alt=media`
            );
          })
          .catch((error) => {
            return res.status(401).json({ error: error });
          });
      }
    }
    if (uploadedFileURL.length === 0) {
      return res
        .status(401)
        .json({ success: false, error: "Product photo is required !!" });
    }
    let newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      retail_price: req.body.retail,
      total_stock: req.body.stock,
      brand: req.body.brand,
      subCategory: req.body.subCategory,
      category: req.body.category,
      description: req.body.description,
      photos: uploadedFileURL,
      related_products: req.body.related_products,
    });
    try {
      let createdProduct = await newProduct.save();
      let product = await createdProduct.populate([
        "category",
        "subCategory",
        "brand",
        "related_products",
      ]);
      await Category.findByIdAndUpdate(req.body.category, {
        $push: {
          products: createdProduct._id,
        },
      });
      await SubCategory.findByIdAndUpdate(req.body.subCategory, {
        $push: {
          products: createdProduct._id,
        },
      });

      return res.status(200).json({ success: true, product });
    } catch (error) { 
      return res.status(401).json({ success: false, error });
    }
  },
];

// EDIT PRODUCT
exports.EDIT_PRODUCT = [
  upload.any("photos"),
  async (req, res) => {
    var uploadedFilesURL = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      if (file) {
        const fileName = file.originalname + new Date();
        const imageRef = ref(storage, fileName);
        const metatype = {
          contentType: file.mimetype,
          name: file.originalname,
        };
        await uploadBytes(imageRef, file.buffer, metatype)
          .then((snapshot) => {
            uploadedFilesURL.push(
              `https://firebasestorage.googleapis.com/v0/b/${snapshot.ref._location.bucket}/o/${snapshot.ref._location.path_}?alt=media`
            );
          })
          .catch((error) => {
            return res.status(401).json({ error });
          });
      }
    }
    try {
      let id = req.body._id;
      let editedProduct = await Product.findByIdAndUpdate(
        id,
        {
          $set: {
            name: req.body.name,
            price: req.body.price,
            retail_price: req.body.retail,
            total_stock: req.body.stock,
            brand: req.body.brand,
            subCategory: req.body.subCategory,
            category: req.body.category,
            description: req.body.description,
            related_products: req.body.related_products,
          },
          $push: {
            photos: {
              $each: uploadedFilesURL,
            },
          },
        },
        { new: true }
      );
      let product = await editedProduct.populate([
        "options",
        "category",
        "subCategory",
        "brand",
        "related_products",
      ]);
      return res.status(200).json({ success: true, product });
    } catch (error) {
      return res.status(401).json({ success: false, error });
    }
  },
];

// GET PRODUCT BY ID
exports.GET_PRODUCT_By_Id = async (req, res) => {
  try {
    let product = await Product.findById(req.body.id).populate([
      "options",
      "subCategory",
      "category",
      "brand",
      "related_products",
    ])
    .populate({
      path:"options",
      path:"subCategory",
      path:"category",
      path:"brand",
      path:"related_products",
      path:"reviews",
      populate:{
        path:"user"
      }
    });
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};

// GET ALL PRODUCTS
exports.GET_All_PRODUCTS = async (req, res) => {
  try {
    let products = await Product.find().populate([
      "options",
      "subCategory",
      "category",
      "brand",
      "related_products",
    ]);
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};

// DELETE PRODUCT BY Id
exports.DELETE_PRODUCT_BY_ID = async (req, res) => { 
  let id = req.body.id;
  let photos = req.body.photos;

  try {
    // delete product's photos 
     await photos.map(photo =>{
        const fileRef = ref(storage,photo)
        deleteObject(fileRef)
      })
      // delete product
    await Product.findByIdAndDelete(id);
    // delete product's options 
    await Option.deleteMany({product:id});
      // delete product reviews
      await Review.deleteMany({product:id})
    // delete product  from category
    await Category.updateMany({},{
      $pull:{
        products:id
      }
    });
     // delete product  from subcategory
    await SubCategory.updateMany({},{
      $pull:{
        products:id
      }
    });
  
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};

exports.edit = async (req, res) => {
  Product.updateMany(
    {},
    {
      $set: {
        category: req.body.category,
        subCategory: req.body.sub,
      },
    },
    {
      new: true,
    }
  )
    .then((products) => {
      return res.status(200).json({ success: true, products });
    })
    .catch((error) => {
      return res.status(401).json({ success: false, error });
    });
};


