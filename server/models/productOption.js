var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const productOptionSchema = new Schema({
  name: { type: String,required: true },
  price: { type: Number, required: true },
  total_stock: { type: Number },
  description: { type: String },
  photos: [{ type: String }],
  product: { type: Schema.Types.ObjectId, ref: "product", required:true },
  deals: [{ type: Schema.Types.ObjectId, ref: "deal", default: [] }],
});

module.exports = mongoose.model("productOption", productOptionSchema, "productOptions");