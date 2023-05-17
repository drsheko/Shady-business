var Category = require("../models/categoryModel");
var Brand = require('../models/brandModal');
const multer = require("multer");
const { ref, uploadBytes } = require("firebase/storage");
const storage = require("../firebase");
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

// Create A Brand 

exports.Create_BRAND = [
    upload.single("photo"),
    async (req, res) => {
      var uploadedFileURL;
      const isNameTaken = await Brand.findOne({ name: req.body.name });
      if (isNameTaken != null) {
        return res.status(401).json({
          success: false,
          error: "This Brand is already in Database",
        });
      }
  
      // upload category image
      const file = req.file;
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
      }else {
        return res
          .status(401)
          .json({ success: false, error: " Brand photo is required !!" });
      }
  
      // create a new category
      let newBrand = new Brand({
        name: req.body.name,
        photo: uploadedFileURL,
      });
      newBrand
        .save()
        .then((brand) => {
          return res.status(200).json({ success: true, brand });
        })
        .catch((error) => {
          return res.status(401).json({ success: false, error });
        });
    },
  ];