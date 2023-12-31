const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name

  if (email === "" || password === "") {
    res.render("auth/signup", { message: "Indicate email and password" });
    return;
  }
  
  User.findOne({ email }).then(
    (foundUser, err)=>{
       
            if (foundUser !== null) {
              res.render("auth/signup", { message: "The email already exists" });
              return;
            }
       
    
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    
    const newUser = new User({
      email,
      name,
      password: hashPass
    });

    newUser.save()
    .then(() => {
      req.login(newUser, () => {
        res.redirect("/");
      });
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
