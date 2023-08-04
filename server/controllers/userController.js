var User = require("../models/userModel");
var Address = require("../models/addressModal");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const { async } = require("@firebase/util");

// Add User
exports.signup_post = async (req, res) => {
  console.log(req.body);
  var form = {
    firstName: req.body.form.firstName,
    lastName: req.body.form.lastName,
    password: req.body.form.password,
    email: req.body.form.email,
    phone: req.body.form.phone,
    dateOfBirth: req.body.form.dateOfBirth,
  };
  const isEmailTaken = await User.findOne({ email: req.body.form.email });
  if (isEmailTaken != null) {
    return res.status(500).json({
      success: false,
      error: "Email is aleardy in use !!",
      form,
    });
  }

  bcrypt.hash(req.body.form.password, 10, (error, hash) => {
    if (error) {
      return res.status(500).json({ success: false, error, form });
    }

    var user = new User({
      firstName: req.body.form.firstName,
      lastName: req.body.form.lastName,
      email: req.body.form.email,
      phone: req.body.form.phone,
      password: hash,
      dateOfBirth: req.body.form.dateOfBirth,
    })
      .save()
      .then((user) => {
        var address = new Address({
          user: user._id,
          line1: req.body.form.addressLine1,
          line2: req.body.form.addressLine2,
          city: req.body.form.city,
          state: req.body.form.state,
          country: req.body.form.country,
          zipcode: req.body.form.zipcode,
        })
          .save()
          .then((newAddress) => {
            User.findByIdAndUpdate(
              user._id,
              {
                $push: {
                  address: newAddress._id,
                },
              },
              { new: true }
            )
              .then((user) => {
                user.populate(["address"]);
                return res.status(200).json({
                  success: true,
                  msg: "Account has created successfully",
                  user,
                });
              })
              .catch((error) => {
                return res.status(500).json({ success: false, error });
              });
          })
          .catch((error) => {
            return res.status(500).json({ success: false, error });
          });
      })
      .catch((error) => {
        return res.status(500).json({ success: false, error });
      });
  });
};

// Login
exports.login_post = function (req, res, next) {
  passport.authenticate("local", function (error, user, info) {
    if (error) {
      return res.status(401).json({ success: false, error });
    }
    if (!user) {
      return res.status(401).json({ success: false, error: info });
    }
    req.logIn(user, function (error) {
      if (error) {
        return res.status(401).json({ success: false, error });
      } else {
        User.findById(user._id)
          .populate(["address", "payments"])
          .then((user) => {
            return res.status(200).json({ success: true, user });
          });
      }
    });
  })(req, res, next);
};

// Log Out
exports.log_out = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.json({ success: false, errors: err });
    }
    var msg = "Log out successfully";
    res.status(200).json({ success: true, msg });
  });
};

// Change Password
exports.changePassword = async (req, res) => {
  console.log(req.body);
  let userId = req.body.id;
  let oldPassword = req.body.currentPassword;
  let newPassword = req.body.newPassword;
  try {
    let user = await User.findById(userId);
    bcrypt.compare(oldPassword, user.password, (error, response) => {
      if (!response) {
        return res
          .status(200)
          .json({ success: false, error: "Incorrect password!!" });
      }
      if (response) {
        bcrypt.hash(newPassword, 10, async (error, hash) => {
          if (hash) {
            let savedUser = await User.findByIdAndUpdate(
              userId,
              {
                $set: {
                  password: hash,
                },
              },
              { new: true }
            );
            let user = await savedUser.populate(["address", "payments"]);
            return res.status(200).json({ success: true, user });
          }
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

// EDIT USER INFO
exports.EDIT_USER_INFO = async (req, res) => {
  try {
    let id = req.body.id;
    const isEmailTaken = await User.findOne({
      email: req.body.email,
      _id: { $ne: id },
    });

    if (isEmailTaken != null) {
      return res.status(200).json({
        success: false,
        error: "Email is aleardy in use !!",
      });
    }
    let savedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
        },
      },
      { new: true }
    );
    let user = await savedUser.populate(["address", "payments"]);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(401).json({ success: false, error });
  }
};
