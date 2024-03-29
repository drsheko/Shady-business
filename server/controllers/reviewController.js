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
  upload.any(),
  async (req, res) => {
    // upload review image
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

    // create a new review
    let newReview = new Review({
      user: req.body.user,
      product: req.body.product,
      rating: req.body.rating,
      comment: req.body.comment,
      photos: uploadedFileURL,
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

      // get average rating
      let avgRating;
      await Product.aggregate([
        {
          $match: {
            $expr: {
              $eq: [
                {
                  $toString: "$_id",
                },
                req.body.product,
              ],
            },
          },
        },
        {
          $lookup: {
            from: "reviews",
            localField: "reviews",
            foreignField: "_id",
            as: "average",
          },
        },
        {
          $unwind: "$average",
        },
        {
          $group: {
            _id: 1,
            rating: {
              $avg: "$average.rating",
            },
          },
        },
      ]).then((result) => {
        avgRating = result[0].rating;
      });

      // save avg rating to product
      await Product.findByIdAndUpdate(req.body.product, {
        $set: {
          rating: avgRating,
        },
      });
      // save review to user
      await User.findByIdAndUpdate(req.body.user, {
        $push: {
          reviews: review._id,
        },
      });
      let savedReview = await review.populate("user")
      return res.status(200).json({ success: true, review:savedReview });
    } catch (error) {
      return res.status(401).json({ success: false, error });
    }
  },
];


exports.Get_PRODUCT_REVIEWS = async(req, res) =>{
  try{
    let productId = req.body.id;
    let reviews = await Review.find({"product":productId}).populate()
  }catch(error){
    return res.status(401).json({ success: false, error });

  }
}