const SubCategory = require("../models/sub_categoryModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const ProductOption = require("../models/productOption");
const Review = require("../models/reviewModel");
const multer = require("multer");
const { ref, uploadBytes } = require("firebase/storage");
const storage = require("../firebase");
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

// Add SUB_CATEGORY
exports.ADD_SubCatgeory = async (req, res) => {
  let name = req.body.name;
  let description = req.body.description;
  let categoryId = req.body.category;
  let isNameTaken = await SubCategory.findOne({ name: name });
  if (isNameTaken != null) {
    return res.status(401).json({
      success: false,
      error: "This sub-category is already in Database",
    });
  } else {
    let newSub = new SubCategory({
      name: name,
      description: description,
      category: categoryId,
    });
    newSub
      .save()
      .then((subCategory) => {
        Category.findByIdAndUpdate(categoryId, {
          $push: {
            sub_categories: subCategory._id,
          },
        })
          .then(() => {
            return res.status(200).json({ success: true, subCategory });
          })
          .catch((error) => {
            return res.status(200).json({ success: false, error });
          });
      })
      .catch((error) => {
        return res.status(200).json({ success: false, error });
      });
  }
};

// Get All SUB
exports.GET_ALL_SUB_CATEGORIES = async (req, res) => {
  SubCategory.find()
    .populate(["category", "products"])
    .then((subCategories) => {
      return res.status(200).json({ success: true, subCategories });
    })
    .catch((error) => {
      return res.status(401).json({ success: false, error });
    });
};

// Get Sub_category by Id ;
exports.GET_ONE_BY_Id = async (req, res) => {
  let id = req.params.id;
  SubCategory.findById(id)
    .populate({
      path: "products",
      populate: [
        {
          path: "category",
        },
        {
          path: "reviews",
          populate: {
            path: "user",
          },
        },
        {
          path: "options",
        },
        {
          path: "subCategory",
        },
      ],
    })
    .then((subCategory) => {
      return res.status(200).json({ success: true, subCategory });
    })
    .catch((error) => {
      return res.status(401).json({ success: false, error });
    });
};

exports.EDIT_SUB_CATEGORY_BY_ID = [
  upload.single("photo"),
  async (req, res) => {
    var uploadedFileURL;
    // upload sub-category image
    const file = req.file;
    if (file) {
      const fileName = file.originalname + new Date();
      const imageRef = ref(storage, fileName);
      const metatype = { contentType: file.mimetype, name: file.originalname };
      await uploadBytes(imageRef, file.buffer, metatype)
        .then((snapshot) => {
          //set new photo
          uploadedFileURL = `https://firebasestorage.googleapis.com/v0/b/${snapshot.ref._location.bucket}/o/${snapshot.ref._location.path_}?alt=media`;
        
        })
        .catch((error) => { console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
          return res.status(401).json({ error: error });
        });
    } else {
      // NO FILE  => KEEP THE PREVIOUS PHOTO
      uploadedFileURL = req.body.photo;
    }
    try {
      let id = req.body._id;
      await SubCategory.findByIdAndUpdate(
        id,
        {
          $set: {
            name: req.body.name,
            category: req.body.category,
            products: req.body.products,
            photo: uploadedFileURL,
          },
        },
        { new: true }
      );
      await Category.findByIdAndUpdate(req.body.category, {
        $addToSet: {
          sub_categories: id,
        },
      });
      await Product.updateMany(
        {
          _id: {
            $in: req.body.products,
          },
        },
        {
          $set: {
            subCategory: id,
          },
        }
      );
      let subCategory = await SubCategory.findById(id).populate(["products",'category']);
      return res.status(200).json({ success: true, subCategory });
    } catch (error) {
      return res.status(401).json({ success: false, error });
    }
  },
];
