const passport = require('koa-passport');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

async function registerLocal(email, password, done) {
  const user = await UserModel.findOne({
    email
  });

  if (!user) {
    done(null, false);
    return;
  }

  const hashPassword = await bcrypt.hash(password, user.salt);

  if (hashPassword !== user.password) {
    done(null, false);
    return;
  }

  done(null, user);

}

async function jwtVerification(jwt_payload, done) {
  const currentUser = jwt_payload;
  try {
    const verifyUser = await UserModel.find( {email: currentUser.email});

    if (!verifyUser) {
      done(false, currentUser);
      return;
    }

    done(null, currentUser);

  } catch (err) {
    done(err, false);
  }

}

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, registerLocal));

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = '1234';
passport.use(new JwtStrategy(opts, jwtVerification));