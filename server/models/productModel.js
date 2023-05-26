var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, minLength: 3, required: true },
  price: { type: Number, required: true },
  retail_price: { type: Number, required: true },
  total_stock: { type: Number, default:0 },
  brand: { type: Schema.Types.ObjectId, ref: "brand" },
  description: { type: String, required: true },
  photos: { type: Array, default: [] },
  related_products: [
    { type: Schema.Types.ObjectId, ref: "product", default: [] },
  ],
  options: [
    { type: Schema.Types.ObjectId, ref: "productOption", default: [] },
  ],
  reviews: [{ type: Schema.Types.ObjectId, ref: "review", default: [] }],
  rating:{type:Number, default:0},
  deals: [{ type: Schema.Types.ObjectId, ref: "deal", default: [] }],
  subCategory: 
    { type: Schema.Types.ObjectId, ref: "subCategory"},
  
  category: { type: Schema.Types.ObjectId, ref: "category" },

});



module.exports = mongoose.model("product", productSchema, "products");
