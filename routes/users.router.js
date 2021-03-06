const Router = require('@koa/router');
const UserModel = require('../models/user.model');
const GroupModel = require('../models/group.model');
const MessageModel = require('../models/message.model');
const passport = require('koa-passport');
class UsersRouter {

  static async get(ctx) {
    try {
      ctx.body = await UserModel.find();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }

  static async getUserData(ctx) {
    try {
      const user = await UserModel.findById(ctx.state.user).select('-password -salt -email');
      ctx.body = user;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  } 

  static async getById(ctx) {
    try {
      const user = await UserModel.findById(ctx.params.id).select('-password -salt -email');
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
      ctx.body = await newUser.save().select('-password -salt -email');
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }

  static async update(ctx) {
    try {
      const group = await UserModel.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
        new: true
      }).select('-password -salt -email');
      if (!group) {
        ctx.throw(404, 'Group not found');
      }
      ctx.body = group;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }

  static async searchByFamilyCode(ctx) {
    try {
      const users = await UserModel.find({ familyCode: ctx.params.text }).select('-password -salt -email');
      if (!users) {
        ctx.throw(404, 'User not found');
        return false;
      }
      ctx.body = users;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }

  static async deleteUser(ctx) {
    try {
      let msg = '';
      const user = await UserModel.findById(ctx.params.id);
      const users = await UserModel.find({
        familyCode: user.familyCode
      });

      if (users.length === 1) {
        await GroupModel.findOneAndDelete({
          familyCode: user.familyCode
        });
        msg = `No members left in group ${user.familyCode}. Group deleted.`;
      } else {
        if (user.role === 'admin') {
          await UserModel.updateMany({
            familyCode: user.familyCode
          }, {
            role: 'admin'
          }, {
            multi: true
          });
          msg = `All users from group ${user.familyCode} are admins now because admin was deleted.`;
        }
      };

      await UserModel.findByIdAndDelete(ctx.params.id, async (err, res) => {
        console.log(`User ${ctx.params.id} deleted. ${msg}`);
      });

      await MessageModel.deleteMany({
        userId: ctx.params.id
      }, async (err, res) => {
        console.log(`User ${ctx.params.id} messages deleted.`)
      });

      ctx.body = {
        ok: 1
      };

    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }

}


const router = new Router({
  prefix: '/users'
});

router.use(passport.authenticate('jwt', {
  session: false
}));

router.get('/', UsersRouter.get);
router.get('/user-logged', UsersRouter.getUserData);
router.get('/search/:text', UsersRouter.searchByFamilyCode);
router.put('/:id', UsersRouter.update)
router.post('/', UsersRouter.create);
router.delete('/:id', UsersRouter.deleteUser);

module.exports = router;