const Router = require('@koa/router');
const GroupModel = require('../models/group.model');


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
}


const router = new Router({
  prefix: '/groups'
});

router.get('/', GroupsRouter.get);
router.get('/:id', GroupsRouter.getById);
router.get('/search/:text', GroupsRouter.search);
router.post('/', GroupsRouter.create);
router.put('/:id', GroupsRouter.update);

module.exports = router;