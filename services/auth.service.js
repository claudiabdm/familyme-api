const passport = require('koa-passport');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const BasicStrategy = require('passport-http').BasicStrategy;
const LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(async (user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});



async function registerUserBasic(username, password, done) {
  if (username === 'admin' && password === 'admin') {
    done(null, {
      _id: 'basic',
      provider: 'basic',
      username: 'admin'
    });
  } else {
    done(null, false);
  }
};

async function registerLocal(email, password, done) {
  const user = await UserModel.findOne({
    email,
  });
  console.log(user.name)
  if (user) {
    if (password === user.password) {
      done(null, user);
    }
  } else {
    done(null, false);
    return;
  }
  // const hashPassword = await bcrypt.hash(password, user.salt);
}



// registramos la estrategia
// passport.use(new BasicStrategy(registerUserBasic));
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, registerLocal));