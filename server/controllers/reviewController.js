var Product = require("../models/productModel");
var Review = require("../models/reviewModel");
var User = require("../models/userModel");
const multer = require("multer");
const { ref, uploadBytes } = require("firebase/storage");
const storage = require("../firebase");
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

// Create A Review
exports.CREATE_Review = [
  upload.single("photo"),
  async (req, res) => {
    var uploadedFileURL;

    // upload review image
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
    // create a new review
    let newReview = new Review({
      user: req.body.user,
      product: req.body.product,
      rating: req.body.rating,
      comment: req.body.comment,
      photo: uploadedFileURL,
    });

    try {
      //save review to db
      let review = await newReview.save();
      // save review to product
      await Product.findByIdAndUpdate(req.body.product, {
        $push: {
          reviews: review._id,
        },
      });
      // save review to user
      await User.findByIdAndUpdate(req.body.user, {
        $push: {
          reviews: review._id,
        },
      });
      return res.status(200).json({ success: true, review });
    } catch (error) {
      return res.status(401).json({ success: false, error });
    }
  },
];
