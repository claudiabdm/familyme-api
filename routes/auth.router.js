const Router = require('@koa/router');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('koa-passport');
const UserModel = require('../models/user.model');
const GroupModel = require('../models/group.model');
class AuthRouter {

  static async signUpCreate(ctx) {
    try {
      const user = await UserModel.findOne({
        email: ctx.request.body.email
      });
      if (user) {
        ctx.throw(409, 'User is already registered');
      }
      const newGroup = new GroupModel({
        name: ctx.request.body.group
      });
      await GroupModel.distinct('familyCode', (err, res) => {
        while (res.includes(newGroup.familyCode)) {
          const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
          for (let i = 0; i < 15; i++) {
            familyCode.push(charset.charAt(Math.floor(Math.random() * charset.length)));
          }
          newGroup.familyCode = familyCode;
        }
      })
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(ctx.request.body.password, salt);
      const newUser = new UserModel({
        name: ctx.request.body.name,
        email: ctx.request.body.email,
        familyCode: newGroup.familyCode,
        salt,
        password,
      });
      await newGroup.save();
      ctx.body = await newUser.save();
      ctx.status = 201;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }

  static async signUpJoin(ctx) {
    try {

      const user = await UserModel.findOne({
        email: ctx.request.body.email
      });
      const userGroup = await GroupModel.findOne({
        familyCode: ctx.request.body.group
      });

      if (user) {
        ctx.throw(409, 'User is already registered');
      }
      if (!userGroup) {
        ctx.throw(404, 'Family code not found');
      }

      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(ctx.request.body.password, salt);
      const newUser = new UserModel({
        name: ctx.request.body.name,
        email: ctx.request.body.email,
        familyCode: ctx.request.body.group,
        salt,
        password,
      });

      ctx.body = await newUser.save();
      ctx.status = 201;

    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }

  static async login(ctx) {

    try {
      const user = await UserModel.findOne({
        email: ctx.request.body.email
      });

      if (!user) {
        ctx.throw(404, 'User not found');
        return;
      }

      const hashPassword = await bcrypt.hash(ctx.request.body.password, user.salt);

      if (hashPassword !== user.password) {
        ctx.throw(401, 'Incorrect password');
        return;
      }

      const token = jsonwebtoken.sign(user._id, '1234');
      ctx.body = {
        token
      };

    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }

}

const router = new Router({
  prefix: '/auth'
});


router.post('/sign-up-create', AuthRouter.signUpCreate);
router.post('/sign-up-join', AuthRouter.signUpJoin);
router.post(
  '/login',
  passport.authenticate('local', {
    session: false,
  }),
  AuthRouter.login);
// router.post('/login', passport.authenticate('local', {
//   successRedirect: '/auth/success',
//   failureRedirect: '/auth/fail'
// }));
// router.get('/success', AuthRouter.success);
// router.get('/fail', AuthRouter.fail);
// router.get('/generate-token', isLogged, AuthRouter.generateToken);

module.exports = router;