var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const subCategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  photo: { type: String },
  category: { type: Schema.Types.ObjectId, ref: "category", default:null },
  products: [{ type: Schema.Types.ObjectId, ref: "product", default: [] }],
  deals: [{ type: Schema.Types.ObjectId, ref: "deal", default: [] }],
});

module.exports = mongoose.model(
  "subCategory",
  subCategorySchema,
  "subCategories"
);
