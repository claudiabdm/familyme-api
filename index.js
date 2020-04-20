const Koa = require('koa');
const body = require('koa-body');
const mongoose = require('mongoose');
const mount = require('koa-mount');
const cors = require('@koa/cors');

const mongoUri = process.env.MONGODB_PROD;
const groupsRouter = require('./routes/groups.router');
const usersRouter = require('./routes/users.router');

const onDBReady = (err) => {
  if (err) {
    console.error('Error connecting', err);
    throw new Error('Error connecting', err);
  };

  const app = new Koa();

  app.use(body());
  app.use(cors())

  
  app.use(mount('/api/v1', groupsRouter.routes()));
  app.use(mount('/api/v1', usersRouter.routes()));
  
  
  const server = require('http').createServer(app.callback());
  const io = require('socket.io')(server);
  
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
    });
    socket.on('new-message', (msg) => {
      io.emit('new-message', msg);
    });
  });
  
  server.listen(process.env.PORT || 3000, function (err) {
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