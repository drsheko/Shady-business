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
  giftCount: { type: Number, default:0 },
  percentageOff:{ type: Number, default:0 },
  amountOff:{ type: Number, default:0 },
  products: [{ type: Schema.Types.ObjectId, ref: "product", default: [] }],
  redeemedBy: [{ type: Schema.Types.ObjectId, ref: "user", default: [] }],
  userMaxRedeem: { type: Number },
  photo:{type:String, default:''},
});

module.exports = mongoose.model("coupon", couponSchema, "coupons");
