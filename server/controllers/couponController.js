var Coupon = require("../models/couponModel");
const multer = require("multer");
const { ref, uploadBytes } = require("firebase/storage");
const storage = require("../firebase");
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

exports.Create_COUPON = [
  upload.single("photo"),
  async (req, res) => {
    var uploadedFileURL;

    // upload coupon image
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

    // create a new coupon
    let newCoupon = new Coupon({
      name: req.body.name,
      code: req.body.code,
      description: req.body.description,
      type: req.body.type,
      automated: req.body.automated,
      active: req.body.active,
      startDate: req.body.startDate,
      expireDate: req.body.expireDate,
      minimumPurchase: req.body.minimumPurchase,
      maximumPurchase: req.body.maximumPurchase,
      products: req.body.products,
      redeemedBy: req.body.redeemedBy,
      userMaxRedeem: req.body.userMaxRedeem,
      data: {
        photo: uploadedFileURL,
        freeGift: req.body.freeGift,
        giftRatio: req.body.giftRatio,
      },
    });
    newCoupon
      .save()
      .then((coupon) => {
        return res.status(200).json({ success: true, coupon });
      })
      .catch((error) => {
        return res.status(401).json({ success: false, error });
      });
  },
];

exports.REMOVE_COUPON_BY_ID = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.body.id);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};

exports.Get_ALL_COUPONS = async (req, res) => {
  try {
    let coupons = await Coupon.find();
    return res.status(200).json({ success: true, coupons });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};
