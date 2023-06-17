var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const couponSchema = new Schema({
  name: { type: String, required:true },
  code: { type: String, required: true },
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
  automated: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  expireDate: { type: Date },
  minimumPurchase: { type: Number }, // negative value for NO MINIUM
  maximumPurchase: { type: Number }, // negative value for NO MAXIMUM
  freeGift: { type: Schema.Types.ObjectId, ref: "product", default: null },
  giftCount: { type: Number, default:null },
  percentageOff:{ type: Number, default:null },
  amountOff:{ type: Number, default:null },
  products: [{ type: Schema.Types.ObjectId, ref: "product", default: [] }],
  redeemedBy: [{ type: Schema.Types.ObjectId, ref: "user", default: [] }],
  userMaxRedeem: { type: Number },
  data: Schema.Types.Mixed,//{photo, freeGift, giftRatio}
});

module.exports = mongoose.model("coupon", couponSchema, "coupons");
