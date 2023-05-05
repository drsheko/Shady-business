var User = require("../models/userModel");
var Address = require("../models/addressModal");
const bcrypt = require("bcryptjs");
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
    return res.status(401).json({
      success: false,
      errors: ["Email is aleardy a member !!"],
      form,
    });
  }

  bcrypt.hash(req.body.form.password, 10, (error, hash) => {
    if (error) {
      console.log(form.password);
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
          zipcode:req.body.form.zipcode
        })
          .save()
          .then((address) => {
            User.findOneAndUpdate(user._id, {
              address: address._id,
            })
            .then( user =>{return res
              .status(200)
              .json({
                success: true,
                msg: "Account has created successfully",
              });})
              .catch(error => {
                return res.status(500).json({ success: false, error });
              })
            
        
          })
          .catch((error) => {console.log("err1",error)
            return res.status(500).json({ success: false, error });
          });
      })
      .catch((error) => {
        return res.status(500).json({ success: false, error });
      });
  });
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
