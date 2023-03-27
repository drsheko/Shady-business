var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, minLength: 3, required: true },
  firstName: { type: String, required: true },
  lasttName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  password: { type: String, minLength: 6, required: true },
  dateOfBirth: { type: Date, required: true },
  address: { type: String, required: true },
  status: { type: String, required: true, default: "member" }, // memeber // admin // manager
  orders: [{ type: Schema.Types.ObjectId, ref: "order", default: [] }],
  lists: {
    like: [],
    wishlist: [],
    saved: [],
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "review", default: [] }],
  payment: [{ type: Schema.Types.ObjectId, ref: "payment", default: [] }],
});

module.exports = mongoose.model("user", userSchema, "users");
