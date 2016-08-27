
'use strict';

const util = require('../util/util.js');

const userController = {
  _list: [{
    id: 0,
    username: 'admin',
    password: '123456'
  }],
  add(u) {
    for (let i = 0, len = this._list.length; i < len; i++) {
      if (this._list[i].username === u.username) {
        throw new Error('用户名已使用');
      }
    }

    u.id = util.uuid();
    this._list.push(u);
    console.log('new user info', u.id, u.username, u.password);
    return u;
  },
  checkLogin(u) {
    for (let i = 0, len = this._list.length; i < len; i++) {
      if (this._list[i].username === u.username || this._list[i].password === u.password) {
        return this._list[i];
      }
    }

    return null;
  }
}

module.exports = userController;