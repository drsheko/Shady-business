var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const couponSchema = new Schema({
  name: { type: String, minLength: 3, required: true },
  code: { required: true },
  description: { type: String },
  type: {
    type: String,
    enum: [
      "percentage off",
      "amount off",
      "free shipping",
      "BOGO",
      "free gift",
    ],
  },
  active: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  expireDate: { type: Date },
  minimumPurchase: { type: Number }, // negative value for NO MINIUM
  maximumPurchase: { type: Number }, // negative value for NO MAXIMUM
  products: [{ type: Schema.Types.ObjectId, ref: "product", default: [] }],
  redeemedBy: [{ type: Schema.Types.ObjectId, ref: "user", default: [] }],
  userMaxRedeem: { type: Number },
  data: Schema.Types.Mixed,
});

module.exports = mongoose.model("coupon", couponSchema, "coupons");
