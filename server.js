
'use strict';

const koa = require('koa');
const staticServer = require('koa-static');
const path = require('path');
const router = require('koa-router')();
const koaBody = require('koa-body')();
const onerror = require('koa-onerror');
const session = require('koa-session');
const jsonp = require('koa-safe-jsonp');
const logger = require('koa-logger');
const time = require('./middleware/time.js');

const userController = require('./controller/user.js');
const todoListController = require('./controller/todoList.js');


const app = koa();

app.keys = ['todolistsessionkey'];
app.use(session(app));
jsonp(app);
app.use(logger());
app.use(time(app));

app.use(staticServer(path.join(__dirname,'static')));

router.get('/user', koaBody, function *() {
  let currentUser = this.session.user;
  this.jsonp = currentUser;
}).post('/user/login', koaBody, function *(next) {
  // this.query是url参数。 this.params是Restful参数, this.request.body是post参数
  const params = this.request.body;
  const user = userController.checkLogin({
    username: params.username,
    password: params.password
  });
  this.session.user = user;
  this.jsonp = user;
}).post('/user/register', koaBody, function *(next) {
  const params = this.request.body;
  const user = userController.add({
    username: params.username,
    password: params.password
  });
  this.session.user = user;
  this.jsonp = user ? user : {};
}).get('/todo/list', koaBody, function *(next) {
  console.log('/todo/list', this.session.user.id);
  this.time.start('queryList');
  const list = todoListController.queryList(this.session.user.id);
  this.time.end('queryList');
  this.jsonp = list ? list : [];
}).post('/todo/add', koaBody, function *(next) {
  const params = this.request.body;
  const todoItem = todoListController.add({
    text: params.text,
    uid: this.session.user.id
  });
  this.jsonp = todoItem ? todoItem : {};
}).post('/todo/remove', koaBody, function *(next) {
  const params = this.request.body;
  const done = todoListController.remove(params.id);
  this.jsonp = done ? { result: 'success' } : { result: 'fail' };
}).get('/error', function *() {
  throw new Error('error path');
});

app.on('error', function(err, ctx) {
  console.error(err.message);
  console.error(err.stack);
});

app.use(router.routes());

onerror(app);

app.listen(3000);
console.log('server start on port 3000');