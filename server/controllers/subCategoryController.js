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
exports.ADD_SubCatgeory = [
  upload.single("photo"),
  async (req, res) => {
    var uploadedFileURL;
    const isNameTaken = await Category.findOne({ name: req.body.name });
    if (isNameTaken != null) {
      return res.status(401).json({
        success: false,
        error: "This Sub-Category is already in Database",
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
    }
    try {
      // create a new sub-category
      let newSubCategory = new SubCategory({
        name: req.body.name,
        photo: uploadedFileURL,
        description: req.body.description,
        products: req.body.products,
        category: req.body.category,
      });
      let savedSubCategory = await newSubCategory.save();
      let subCategory = await SubCategory.findById(
        savedSubCategory._id
      ).populate(["products", "category"]);
      // update category
      await Category.findByIdAndUpdate(savedSubCategory.category, {
        $addToSet: {
          sub_categories: savedSubCategory._id,
        },
      });
      // update products
      await Product.updateMany(
        {
          _id: {
            $in: req.body.products,
          },
        },
        {
          $set: {
            subCategory: savedSubCategory._id,
          },
        }
      );
      return res.status(200).json({ success: true, subCategory });
    } catch (error) {
      return res.status(401).json({ success: false, error });
    }
  },
];

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
     
    }).populate('category')
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
        .catch((error) => {
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
            description: req.body.description,
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
      let subCategory = await SubCategory.findById(id).populate([
        "products",
        "category",
      ]);
      return res.status(200).json({ success: true, subCategory });
    } catch (error) {
      return res.status(401).json({ success: false, error });
    }
  },
];

// DELETE Sub-CATEGORY BY ID
exports.DELETE_SUB_CATEGORY_BY_ID = async (req, res) => {
  let subId = req.body._id;
  try {
    // delete sub-category
    await SubCategory.findByIdAndDelete(subId);

    // delete from category
    await Category.findByIdAndUpdate(req.body.category, {
      $pull: {
        sub_categories: subId,
      },
    });
    // delete products
    await Product.deleteMany({
      _id: {
        $in: req.body.Products,
      },
    });
    // delete PRoducts Options
    await ProductOption.deleteMany({
      product: {
        $in: req.body.Products,
      },
    });
    // delete products reviews
    await Review.deleteMany({
      product: {
        $in: req.body.Products,
      },
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};
