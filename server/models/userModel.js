var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, minLength: 6, required: true },
  dateOfBirth: { type: Date, required: true },
  address: [{ type:  Schema.Types.ObjectId, ref: "address", default: [] }],
  status: { type: String, required: true, default: "member" }, // memeber // admin // manager
  orders: [{ type: Schema.Types.ObjectId, ref: "order", default: [] }],
  cart: [
    {
      product: { type: Schema.Types.ObjectId, ref: "product" },
      option: { type: Schema.Types.ObjectId, ref: "productOption" , default:null},
      inCart: { type: Number, default: 1 },
    },
  ],
  lists: {
    like: [],
    wishlist: [],
    saved: [],
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "review", default: [] }],
  payments: [{ type: Schema.Types.ObjectId, ref: "payment", default: [] }],
  temporaryCode :{type:String, default:""},
  createAt:{type: Date, default : Date.now}
});

module.exports = mongoose.model("user", userSchema, "users");
