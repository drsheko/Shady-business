var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  product: { type: Schema.Types.ObjectId, ref: "product" },
  rating: { type: Number, required:true },
  comment: { type: String },
  date: { type: Date, default : Date.now },
 photos: [{ type: String, default: [] }],
});

module.exports = mongoose.model("review", reviewSchema, "reviews");