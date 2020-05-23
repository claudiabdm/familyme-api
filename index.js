const Koa = require('koa');
const body = require('koa-bodyparser');
const mongoose = require('mongoose');
const mount = require('koa-mount');
const cors = require('@koa/cors');
const validate = require('koa-validate');
const passport = require('koa-passport');
const jwt = require('koa-jwt');

const secret = process.env.JWT_SECRET;
const mongoUri = process.env.MONGODB_PROD;
const groupsRouter = require('./routes/groups.router');
const usersRouter = require('./routes/users.router');
const authRouter = require('./routes/auth.router');
const messagesRouter = require('./routes/messages.router');
const MessageModel = require('./models/message.model');


const onDBReady = (err) => {
  if (err) {
    console.error('Error connecting', err);
    throw new Error('Error connecting', err);
  };

  const app = new Koa();

  app.use(body());
  app.use(cors());
  validate(app);

  //  auth
  require('./services/auth.service');
  app.use(passport.initialize());
  app.use(authRouter.routes());

  app.use(jwt({
    secret: secret,
    passthrough: true
  }));

  app.use(async (ctx, next) => {
    if (!ctx.isAuthenticated()) {
      ctx.body = {
        msg: 'User is not authorizated'
      }
      ctx.status = 401;
      return;
    }
    await next();
  });

  // routes
  app.use(mount('/api/v1', groupsRouter.routes()));
  app.use(mount('/api/v1', usersRouter.routes()));
  app.use(mount('/api/v1', messagesRouter.routes()));


  // socket io
  const server = require('http').createServer(app.callback());
  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    socket.on('join', (groupRoom) => {
      socket.join(groupRoom, () => {
        console.log(`User connected to room ${groupRoom}`)
      });
    })
    socket.on('chat', async (msg) => {
      await new MessageModel(msg).save();
      io.to(msg.groupId).emit('received', msg);
      console.log(`${msg.userId} send a msg to ${msg.groupId}`);
    });
    socket.on('disconnect', () => {
      console.log(`User disconnected`)
    });
  });


  // server listener
  server.listen(process.env.PORT || 3000, function (err) {
    if (err) {
      console.error(`Error listening in port ${ process.env.PORT || 3000}`, err);
      process.exit(1);
    }
    console.log(`Koa server listening in port ${ process.env.PORT || 3000}`);
  });
}

mongoose.connect(mongoUri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}, onDBReady);