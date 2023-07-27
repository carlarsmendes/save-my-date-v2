const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/User');
const bcrypt        = require('bcrypt');

/*
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, 
  (email, password, done) => {
    User.findOne({ email })
    .then(foundUser => {
      if (!foundUser) {
        done(null, false, { message: 'Incorrect email' });
        return;
      }

      if (!bcrypt.compareSync(password, foundUser.password)) {
        done(null, false, { message: 'Incorrect password' });
        return;
      }

      done(null, foundUser);
    })
    .catch(err => done(err));
  }
));*/


passport.use(new LocalStrategy(
    function(email, password, done) {


      User.findOne({ email  }).then((foundUser)=>{
        if (err) { return done(err); }
        if (!foundUser) { return done(null, false); }
        if (!foundUser.verifyPassword(password)) { return done(null, false); }
        if (!bcrypt.compareSync(password, foundUser.password)) {
            done(null, false, { message: 'Incorrect password' });
            return;
          }
        return done(null, foundUser);
      });
    }
  ));
