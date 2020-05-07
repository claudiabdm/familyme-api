const Router = require('koa-router');
const jsonwebtoken = require('jsonwebtoken');
const passport = require('koa-passport');
const UserModel = require('../models/user.model');

class AuthRouter {

  static async createUser(ctx) {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(ctx.request.body.password, salt);

    await new UserModel({
      email: ctx.request.body.email,
      provider: 'local',
      salt,
      password
    }).save();
    ctx.redirect('/auth/login');
  }

  static async success(ctx) {
    
    ctx.body = ctx.state.user;
  };

  static async fail(ctx) {
    ctx.body = ctx;
  }

  static async generateToken(ctx) {
    const user = ctx.state.user;
    const token = jsonwebtoken.sign({
      email: user.email,
      _id: user._id
    }, '1234');
    ctx.body = token;
  };

}

const isLogged = async(ctx, next) => {
  console.log('islogged', ctx)
  if (!ctx.isAuthenticated()) {
      ctx.redirect('/auth/login');
      return;
  }
  await next();
}

const router = new Router({
  prefix: '/auth'
});


router.post('/sign-up', AuthRouter.createUser);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/auth/success',
  failureRedirect: '/auth/fail'
}));
router.get('/success', AuthRouter.success);
router.get('/fail', AuthRouter.fail);
router.get('/generate-token', isLogged, AuthRouter.generateToken);

module.exports = router;