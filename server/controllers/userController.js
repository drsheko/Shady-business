var User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");


// Add User
exports.signup_post = [
  body("username")
    .isString()
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Username should be at least 3 character"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Password should be at least 6 character"),
  body("confirmPassword")
    .trim()
    .escape()
    .custom(async (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match");
      }
      return true;
    }),

  async (req, res, next) => {
    var form = {
      username: req.body.username,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      dateOfBirth:req.body.dateOfBirth
    };
    const isUsernameTaken = await User.findOne({ username: req.body.username });
    if (isUsernameTaken != null) {
      return res
        .status(401)
        .json({
          success: false,
          errors: ["Username is aleardy taken !!"],
          form,
        });
    }
    var errorsArr = [];
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var errorsMsg = errors.errors.map((err) => err.msg);

      errorsArr.push(errorsMsg);
      return res.status(401).json({ success: false, errors: errorsMsg, form });
    }

    bcrypt.hash(req.body.password, 10, (error, hash) => {
      if (error) {
        return res.status(401).json({ success: false, errors: [error] });
      }

      var user = new User({
        username: req.body.username,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        dateOfBirth:req.body.dateOfBirth
      }).save((error) => {
        if (error) {
          return res.status(401).json({ success: false, errors: [error] });
        }
        return res
          .status(200)
          .json({ success: true, msg: "Account has created successfully" });
      });
    });
  },
];

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
                return res.status(401).json({ success: false, error });
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
                    return res.status(401).json({ success: false, error });
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
