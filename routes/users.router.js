const Router = require('koa-router');
const mongoose = require('mongoose');
const UserModel = require('../models/user.model');


class UsersRouter {
  static async get(ctx) {
    try {
      ctx.body = await UserModel.find();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }
  
  static async getById(ctx) {
    try {
      const user = await UserModel.findById(ctx.params.id);
      if (!user) {
        ctx.throw(404, 'User not found');
        return false;
      }
      ctx.body = user;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }
  
  static async create(ctx) {
    try {
      const newUser = new UserModel(ctx.request.body);
      ctx.body = newUser.save();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }

  static async update(ctx) {
    try {
      const group = await UserModel.findByIdAndUpdate(ctx.params.id, ctx.request.body, {new: true});
      if (!group) {
        ctx.throw(404, 'Group not found');
      }
      ctx.body = group;
    } catch(err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }
  
  static async search(ctx) {
    try {
      const user = await UserModel.find({$text: {$search: `\"${ctx.params.text}\"`}});
      if (!user) {
        ctx.throw(404, 'User not found');
        return false;
      }
      ctx.body = user;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }
}

const router = new Router({
  prefix: '/users'
});

router.get('/', UsersRouter.get);
router.get('/:id', UsersRouter.getById);
router.get('/search/:text', UsersRouter.search);
router.post('/', UsersRouter.create);
router.put('/:id', UsersRouter.update)

module.exports = router;