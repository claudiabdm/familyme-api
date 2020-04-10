const Koa = require('koa');
const body = require('koa-body');
const mongoose = require('mongoose');
const mount = require('koa-mount');
const cors = require('@koa/cors');

const mongoUri = 'mongodb://localhost:27017/familyapp';
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

  // app.listen(3000, function (err) {
  //   if (err) {
  //     console.error('Error listening in port 3000', err);
  //     process.exit(1);
  //   }
  //   console.log('Koa server listening in port 3000');
  // });
  const port = process.env.PORT ? process.env.PORT : 3000;
  app.listen(port, function (err) {
    if (err) {
      console.error(`Error listening in port ${port}`, err);
      process.exit(1);
    }
    console.log(`Koa server listening in port ${port}`);
  });
}

mongoose.connect(mongoUri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}, onDBReady);