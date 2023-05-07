var User = require("../models/userModel");
var Address = require("../models/addressModal");
const bcrypt = require("bcryptjs");
const passport = require('passport')
const { body, validationResult } = require("express-validator");

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
  console.log("form:", form);
  const isEmailTaken = await User.findOne({ email: req.body.form.email });
  if (isEmailTaken != null) {
    console.log(1);
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
          city: req.body.form.state,
          state: req.body.form.state,
          country: req.body.form.country,
          zipcode: req.body.form.zipcode,
        })
          .save()
          .then((newAddress) => {
            User.findByIdAndUpdate(user._id, {
              $push:{
                address: newAddress._id
              }
              
            },{new:true})
              .then((user) => {
                return res.status(200).json({
                  success: true,
                  msg: "Account has created successfully",
                  user
                });
              })
              .catch((error) => {
                return res.status(500).json({ success: false, error });
              });
          })
          .catch((error) => {
            console.log("err1", error);
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
  console.log(req.body)
  passport.authenticate("local", function (error, user, info) {
    if (error) {
      return res.status(401).json({success:false, error });
    }
    if (!user) {console.log('running')
      return res.status(401).json({ success:false, error: info });
    }
    req.logIn(user, function (error) {
      if (error) {
        return res.status(401).json({ success:false, error });
      } else {
        return res.status(200).json({ success: true, user });
        
      }
      
    });
  })(req, res, next);
};

// Change Password
exports.changePassword = (req, res) => {
  let userId = req.body.userId;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  User.findById(userId, (error, user) => {
    if (error) {
      return res.status(401).json({ success: false, error });
    }
    if (user) {
      bcrypt.compare(oldPassword, user.password, (error, response) => {
        if (error) {
          return res.status(401).json({ success: false, error });
        }
        if (!response) {
          return res
            .status(200)
            .json({ success: false, error: "Incorrect password!!" });
        }
        if (response) {
          bcrypt.hash(newPassword, 10, (error, hash) => {
            if (error) {
              return res.status(500).json({ success: false, error });
            } else {
              User.findByIdAndUpdate(
                userId,
                {
                  $set: {
                    password: hash,
                  },
                },
                { new: true }
              ).exec((error, user) => {
                if (error) {
                  return res.status(500).json({ success: false, error });
                } else {
                  return res.status(200).json({ success: true, user });
                }
              });
            }
          });
        }
      });
    }
  });
};
