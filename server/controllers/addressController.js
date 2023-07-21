var Address = require("../models/addressModal");
var User = require("../models/userModel");

// Create Address
exports.Create_ADDRESS = async (req, res) => {
  console.log(req.body);
  try {
    let newAddress = new Address({
      user: req.body.user,
      line1: req.body.line1,
      line2: req.body.line2,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zipcode: req.body.zipcode,
    });
    let address = await newAddress.save();
    if (req.body.saveNewAddress) {
      await User.findByIdAndUpdate(req.body.user, {
        $push: {
          address: address._id,
        },
      });
    }
    return res.status(200).json({ success: true, address });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};

// EDIT ADDRESS
exports.EDIT_ADDRESS = async (req, res) => {
  try {
    let id = req.body._id;
    let address = await Address.findByIdAndUpdate(id, {
      $set: {
        line1: req.body.line1,
        line2: req.body.line2,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        zipcode: req.body.zipcode,
      },
    });
    return res.status(200).json({ success: true, address });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};
