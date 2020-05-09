const Router = require('@koa/router');
const MessageModel = require('../models/message.model');
const ObjectId = require('mongoose').Types.ObjectId;

class MessagesRouter {

  static async getMessagesByGroupId(ctx) {
    try {
      const messages = await MessageModel.find({groupId: ctx.params.id});
      if (!messages) {
        ctx.throw(404, 'Messages not found');
        return false;
      }
      ctx.body = messages;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `${ctx.status}: ${err.message}`;
    }
  }

}

const router = new Router({
  prefix: '/messages'
});

router.get('/:id',MessagesRouter.getMessagesByGroupId);

module.exports = router;
