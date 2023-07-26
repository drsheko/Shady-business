var Order = require("../models/orderModel");
var Address = require("../models/addressModal");
var User = require("../models/userModel");

// CREATE A NEW ORDER
exports.CREATE_NEW_ORDER = async (req, res) => {
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
      discount: req.body.discount,
      tax: req.body.tax,
      total: req.body.total,
    });
    let savedOrder = await newOrder.save();
    let order = await savedOrder.populate([
      {
        path: "user",
      },
      {
        path: "billingAddress",
      },
      {
        path: "payment",
      },
      {
        path: "shipping",
        populate: {
          path: "address",
        },
      },
      {
        path: "products",
        populate: [
          {
            path: "product",
          },
          {
            path: "option",
          },
        ],
      },
    ]);
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};

// GET ORDERS BY USER ID
exports.GET_ORDERS_BY_USER_ID = async (req, res) => {
  try {
    let id = req.body.userId;
    console.log(id)
    let orders = await Order.find({ user: id }).populate([
      {
        path: "user",
      },
      {
        path: "billingAddress",
      },
      {
        path: "payment",
      },
      {
        path: "shipping",
        populate: {
          path: "address",
        },
      },
      {
        path: "products",
        populate: [
          {
            path: "product",
          },
          {
            path: "option",
          },
        ],
      },
    ]);;
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};
