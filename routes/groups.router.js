const Router = require('@koa/router');
const GroupModel = require('../models/group.model');
const UserModel = require('../models/user.model');
const MessageModel = require('../models/message.model');


class GroupsRouter {
  static async get(ctx) {
    try {
      ctx.body = await GroupModel.find();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }

  static async getById(ctx) {
    try {
      const group = await GroupModel.findById(ctx.params.id);
      if (!group) {
        ctx.throw(404, 'Group not found');
        return false;
      }
      ctx.body = group;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }

  static async create(ctx) {
    try {
      const newGroup = new GroupModel(ctx.request.body);
      await GroupModel.distinct('familyCode', (err, res) => {
        while (res.includes(newGroup.familyCode)) {
          const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
          for (let i=0; i < 15; i++) { 
            familyCode.push(charset.charAt(Math.floor(Math.random()*charset.length))); 
          }
          newGroup.familyCode = familyCode;
        }
      })
      ctx.body = await newGroup.save();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }

  static async update(ctx) {
    try {
      const group = await GroupModel.findByIdAndUpdate(ctx.params.id, ctx.request.body, {new: true});
      if (!group) {
        ctx.throw(404, 'Group not found');
      }
      ctx.body = group;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }

  static async search(ctx) {
    try {
      const user = await GroupModel.find({
        $text: {
          $search: `\"${ctx.params.text}\"`
        }
      });
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

  static async deleteGroup(ctx) {
    try {
      const user = await UserModel.findById(ctx.params.userId);

      if (user.role === 'admin') {
        const group = await GroupModel.findById(ctx.params.id);
        await UserModel.deleteMany({familyCode: group.familyCode});
        console.log(`Users from Group ${ctx.params.id} deleted.`)
        await MessageModel.deleteMany({groupId: ctx.params.id});
        console.log(`Messages in Group ${ctx.params.id} deleted.`)
        await GroupModel.findByIdAndDelete(ctx.params.id);
        console.log(`Group ${ctx.params.id} deleted.`)
        ctx.body = {
          ok: 1
        };
      } else {
        ctx.throw(404, 'User is not admin');
        return false;
      }

    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }
}


const router = new Router({
  prefix: '/groups'
});

router.get('/', GroupsRouter.get);
router.get('/:id', GroupsRouter.getById);
router.get('/search/:text', GroupsRouter.search);
router.post('/', GroupsRouter.create);
router.put('/:id', GroupsRouter.update);
router.delete('/:id/:userId', GroupsRouter.deleteGroup);

module.exports = router;