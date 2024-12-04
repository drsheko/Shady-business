var Payment = require("../models/paymentModal");
var User = require("../models/userModel");

// Create A NEW PAYMENT METHOD
exports.Create_NEW_CARD = async (req, res) => { 
  try {
    let newCard = new Payment({
      user: req.body.user,
      cardNumber: req.body.number,
      cardHolder: req.body.name,
      cvc: req.body.cvc,
      expiration: req.body.date,
      default: req.body.default,
    });
    let payment = await newCard.save();
    if (req.body.saveToAccount) {
      await User.findByIdAndUpdate(req.body.user, {
        $push: {
          payments: payment._id,
        },
      });
    }
    return res.status(200).json({ success: true, payment });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};
