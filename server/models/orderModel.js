var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  date: { type: Date, required: true },
  phone: { type: Number },
  email: { type: String },
  address: { type: String, required: true },
  status: { type: String, default: "pending" },
  note: { type: String },
  payment: { type: Schema.Types.ObjectId, ref: "payment", default: [] },
  deals: [{ type: Schema.Types.ObjectId, ref: "deal", default: [] }],
  products: [{ type: Schema.Types.ObjectId, ref: "product", default: [] }],
});

module.exports = mongoose.model("order", orderSchema, "orders");
