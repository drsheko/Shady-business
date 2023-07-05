var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const paymentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  cardNumber: { type: Number, required: true },
  cardHolder: { type: String , required: true},
  cvc: { type: Number, required: true },
  expiration: { type: Date, required:true },
  default:{type:Boolean, default:false}
});

module.exports = mongoose.model("payment", paymentSchema, "payments");