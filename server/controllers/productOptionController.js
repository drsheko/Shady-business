var Product = require("../models/productModel");
var Option = require("../models/productOption");
var SubCategory = require("../models/sub_categoryModel");
const multer = require("multer");
const { ref, uploadBytes } = require("firebase/storage");
const storage = require("../firebase");
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });


// Create PRoduct Option 
exports.CREATE_OPTION = [
    upload.any("photo"),
  async (req, res) => {
    var uploadedFileURL;
    const isNameTaken = await Option.findOne({ name: req.body.name });
    if (isNameTaken != null) {
      return res.status(401).json({
        success: false,
        error: "This Option is already in Database",
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
        .json({ success: false, error: " Option photo is required !!" });
    }
    let newOption = new Option({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      total_stock: req.body.stock,
      photos: uploadedFileURL,
      product: req.body.product,
    });

    newOption
      .save()
      .then((option) => {
        Product.findByIdAndUpdate(req.body.product, {
          $push: {
            options: option._id,
          },
          $inc:{
            total_stock:option.total_stock
          }
        }).then(() => {
          return res.status(200).json({ success: true, option });
        });
      })
      .catch((error) => {
        return res.status(401).json({ success: false, error });
      });
  },
]
