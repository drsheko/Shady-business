var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const brandSchema = new Schema({
  name: { type: String, required: true },
  photo: { type: String },
  products: [{ type: Schema.Types.ObjectId, ref: "product", default: [] }],
  deals: [{ type: Schema.Types.ObjectId, ref: "deal", default: [] }],
});

module.exports = mongoose.model("brand", brandSchema, "brands");
