var Category = require("../models/categoryModel");
const subCategory = require("../models/sub_categoryModel");
const Product = require("../models/productModel");
const multer = require("multer");
const { ref, uploadBytes } = require("firebase/storage");
const storage = require("../firebase");
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

// Create A new category
exports.addCategory = [
  upload.single("photo"),
  async (req, res) => {
    var uploadedFileURL;
    const isNameTaken = await Category.findOne({ name: req.body.name });
    if (isNameTaken != null) {
      return res.status(401).json({
        success: false,
        error: "This Category is already in Database",
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
      // create a new category
      let newCategory = new Category({
        name: req.body.name,
        photo: uploadedFileURL,
        products: req.body.products,
        sub_categories: req.body.subCategories,
      });
      let savedCategory = await newCategory.save();
      let category = await Category.findById(savedCategory._id)
        .populate({
          path: "sub_categories",
          populate: [
            {
              path: "products",
            },
            {
              path: "category",
            },
          ],
        })
        .populate("products");
      // update subCategories
      await subCategory.updateMany(
        {
          _id: {
            $in: req.body.subCategories,
          },
        },
        {
          $set: {
            category: savedCategory._id,
          },
        }
      );
      // update products
      await Product.updateMany(
        {
          _id: {
            $in: req.body.products,
          },
        },
        {
          $set: {
            category: savedCategory._id,
          },
        }
      );
      return res.status(200).json({ success: true, category });
    } catch (error) {
      return res.status(401).json({ success: false, error });
    }
  },
];

// Edit Category photo

exports.Edit_Category_photo_BY_ID = [
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

          Category.findByIdAndUpdate(req.body.id, {
            $set: {
              photo: uploadedFileURL,
            },
          })
            .then((category) => {
              return res.status(200).json({ success: true, category });
            })
            .catch((error) => {
              return res.status(401).json({
                success: false,
                error: "CAN NOT UPDATE THIS CATEGORY !!",
              });
            });
        })
        .catch((error) => {
          return res
            .status(401)
            .json({ success: false, error: "CAN NOT UPLOAD THIS PHOTO" });
        });
    } else {
      return res
        .status(200)
        .json({ success: false, error: "NEW PHOTO IS REQUIRED !!" });
    }
  },
];

// Get All Categories
exports.All_Categories = async (req, res) => {
  try {
    let allCategories = await Category.find()
      .populate({
        path: "sub_categories",
        populate: [
          {
            path: "products",
          },
          {
            path: "category",
          },
        ],
      })
      .populate("products");
    return res.status(200).json({ success: true, allCategories });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, error });
  }
};

//get category by id
exports.GET_CATEGORY_BY_Id = async (req, res) => {
  console.log(req.body.id);
  try {
    let category = await Category.findById(req.body.id).populate({
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
    });
    return res.status(200).json({ success: true, category });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};
exports.update = async (req, res) => {
  try {
    let data = await Category.updateMany(
      {},
      {
        $set: {
          products: [],
        },
      }
    );
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};

exports.EDIT_CATEGORY_BY_ID = [
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
      await Category.findByIdAndUpdate(
        id,
        {
          $set: {
            name: req.body.name,
            sub_categories: req.body.subCategories,
            products: req.body.products,
            photo: uploadedFileURL,
          },
        },
        { new: true }
      );
      await subCategory.updateMany(
        {
          _id: {
            $in: req.body.subCategories,
          },
        },
        {
          $set: {
            category: id,
          },
        }
      );
      await Product.updateMany(
        {
          _id: {
            $in: req.body.products,
          },
        },
        {
          $set: {
            category: id,
          },
        }
      );
      let category = await Category.findById(id)
        .populate({
          path: "sub_categories",
          populate: [
            {
              path: "products",
            },
            {
              path: "category",
            },
          ],
        })
        .populate("products");
      return res.status(200).json({ success: true, category });
    } catch (error) {
      return res.status(401).json({ success: false, error });
    }
  },
];
