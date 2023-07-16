var Order = require("../models/orderModel");
var Address = require("../models/addressModal");
var User = require("../models/userModel");

// CREATE A NEW ORDER
exports.CREATE_NEW_ORDER = async (req, res) => {
  console.log(req.body);
  try {
    let newOrder = new Order({
      user: req.body.user,
      phone: req.body.phone,
      email: req.body.email,
      billingAddress: req.body.billingAddress,
      note: req.body.note,
      payment: req.body.payment,
      coupons: req.body.coupon,
      products: req.body.products,
      shipping: {
        address: req.body.shipping.address,
        method: req.body.shipping.method,
        cost: req.body.shipping.cost,
      },
      tax: req.body.tax,
      total:req.body.total,
    });
    let savedOrder = await newOrder.save();
    let order = await savedOrder.populate(['user',"products",])
    return res.status(200).json({success:true, order})
  } catch (error) {
    console.log("ssssssssss",error)
    return res.status(401).json({ success: false, error });
  }
};
