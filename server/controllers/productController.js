var Product = require("../models/productModel");
var Option = require("../models/productOption");
var SubCategory = require("../models/sub_categoryModel");
const multer = require("multer");
const { ref, uploadBytes } = require("firebase/storage");
const storage = require("../firebase");
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

// CREATE PRODUCT
exports.CREATE_PRODUCT = [
  upload.single("photo"),
  async (req, res) => {
    var uploadedFileURL;
    const isNameTaken = await Product.findOne({ name: req.body.name });
    if (isNameTaken != null) {
      return res.status(401).json({
        success: false,
        error: "This Product is already in Database",
      });
    }
    var file = req.file;
    if (file) {
      const fileName = file.originalname + new Date();
      const imageRef = ref(storage, fileName);
      const metatype = { contentType: file.mimetype, name: file.originalname };
      await uploadBytes(imageRef, file.buffer, metatype)
        .then((snapshot) => {
          uploadedFileURL = `https://firebasestorage.googleapis.com/v0/b/${snapshot.ref._location.bucket}/o/${snapshot.ref._location.path_}?alt=media`;
        })
        .catch((error) => {
          return res.status(401).json({ error: error });
        });
    } else {
      return res
        .status(401)
        .json({ success: false, error: " Product photo is required !!" });
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

    newProduct
      .save()
      .then((product) => {
        SubCategory.findByIdAndUpdate(req.body.subCategory, {
          $push: {
            products: product._id,
          },
        }).then(() => {
          return res.status(200).json({ success: true, product });
        });
      })
      .catch((error) => {
        return res.status(401).json({ success: false, error });
      });
  },
];

// GET PRODUCT BY ID 
exports.GET_PRODUCT_By_Id = async(req, res) => {
  try{
    let product = await Product.findById(req.body.id).populate(['options', 'subCategory']);
    return res.status(200).json({success:true, product})
  }catch(error){
    return res.status(401).json({success:false, error})
  }
}
