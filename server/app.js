require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var session = require("express-session");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var Routers = require("./routes/routers");
var bcrypt = require("bcryptjs");
var cors = require("cors");
const multer = require("multer");
var User = require('./models/userModel')

// Mongo_DB Setup
mongoDB =

  "mongodb+srv://drsheko91:"
  +process.env.MONGO_PASSCODE+
  "@shady-business.tguywpm.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongo Connection Error"));

var app = express();

// multer
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// passport setup
passport.use(new LocalStrategy({usernameField: 'email',
passwordField: 'password'},(username,password,done)=>{  
  try{ 
      User.findOne({email:username}).then(user=>{
        
          if (!user){ 
              return done(null,false, {message:"Incorrect Username"})
          }
          bcrypt.compare(password,user.password,function(err,result){ 
              if (err){
                  return done(err)
              }

              if (result) {
                  return done(null,user)
              }
              else {
                  return done (null,false, {message:"Incorrect Password"})
              }
          })

      })
  }
  catch (err){
          return done(err)
  }

}))

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


app.use(cors());
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
/*
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});
*/

// Routes setup
app.use("/", Routers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
