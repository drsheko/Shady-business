var Category = require("../models/categoryModel");
var Brand = require("../models/brandModal");
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

    // upload brand image
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
    } else {
      return res
        .status(401)
        .json({ success: false, error: " Brand photo is required !!" });
    }

    // create a new brand
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

// GET ALL BRANDS
exports.GET_ALL_BRANDS = async (req, res) => {
  try {
    let brands = await Brand.find().populate("products");
    return res.status(200).json({ success: true, brands });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};

// GET BRAND BY ITS ID
exports.GET_BRAND_BY_ID = async (req, res) => {
  try {
    let brand = await Brand.findById(req.body.id).populate([
      {
        path: "products",
        populate: {
          path: "category",
        },
      },
      {
        path: "products",
        populate: {
          path: "subCategory",
        },
      },
    ]);
    return res.status(200).json({ success: true, brand });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};

// Edit Brand BY ITS ID
exports.EDIT_BRAND_BY_ID = [
  upload.single("photo"),
  async (req, res) => {
    var uploadedFileURL;
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
    } else {
      // NO FILE  => KEEP THE PREVIOUS PHOTO
      uploadedFileURL = req.body.photo;
    }

    try {
      let id = req.body._id;
      await Brand.findByIdAndUpdate(
        id,
        {
          $set: {
            name: req.body.name,
            products: req.body.products,
            photo: uploadedFileURL,
          },
        },
        { new: true }
      );

      await Product.updateMany(
        {
          _id: {
            $in: req.body.products,
          },
        },
        {
          $set: {
            brand: id,
          },
        }
      );
      let brand = await Brand.findById(id).populatepopulate([
        {
          path: "products",
          populate: {
            path: "category",
          },
        },
        {
          path: "products",
          populate: {
            path: "subCategory",
          },
        },
      ]);
      return res.status(200).json({ success: true, brand });
    } catch (error) {
      return res.status(401).json({ success: false, error });
    }
  },
];
