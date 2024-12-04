var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user", required: true }, 
  cart: [
    {
      product: { type: Schema.Types.ObjectId, ref: "product" },
      option: { type: Schema.Types.ObjectId, ref: "productOption" , default:null},
      quantity: { type: Number, default: 1 },
    },
  ],
  
  updateAt: { type: Date, default: Date.now},

});

module.exports = mongoose.model("cart", cartSchema, "carts");