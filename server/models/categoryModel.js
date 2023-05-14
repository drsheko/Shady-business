var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
  photo:{type:String },
  sub_categories: [
    { type: Schema.Types.ObjectId, ref: "subCategory", default: [] },
  ],
  deals: [{ type: Schema.Types.ObjectId, ref: "deal", default: [] }],
});

module.exports = mongoose.model("category", categorySchema, "categories");
