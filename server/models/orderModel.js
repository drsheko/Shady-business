var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  phone: { type: String },
  email: { type: String },
  billingAddress: {
    type: Schema.Types.ObjectId,
    ref: "address",
    required: true,
  },
  status: { type: String, default: "pending" },
  note: { type: String },
  payment: { type: Schema.Types.ObjectId, ref: "payment", default: [] },
  coupons: [{ type: Schema.Types.ObjectId, ref: "coupon", default: [] }],
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "product" },
      quantity: { type: Number, default: 1 },
      price: { type: Number },
    },
  ],
  shipping: {
    address: { type: Schema.Types.ObjectId, ref: "address", required: true },
    method: { type: String },
    cost: { type: Number },
  },
  return: [{ type: Schema.Types.ObjectId, ref: "product", default: [] }],
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  createAt: { type: Date, default: Date.now()},
  shippedAt: { type: Date },
  deliveredAt: { type: Date },
});

module.exports = mongoose.model("order", orderSchema, "orders");
