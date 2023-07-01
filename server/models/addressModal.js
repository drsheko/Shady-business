var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const addressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  line1: { type: String, required: true },
  line2: { type: String , default:''},
  city: { type: String, required: true },
  state: { type: String, required:true },
  country: { type: String ,required:true},
  zipcode: { type: Number, required:true },
  default:{type:Boolean, default:false}
});

module.exports = mongoose.model("address", addressSchema, "addresses");