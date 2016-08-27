
'use strict';

const util = require('../util/util.js');

let todoListController = {
  _list: [],   // uid, id, text
  add(item) {
    item.id = util.uuid();
    this._list.push(item);
    return item;
  },
  queryList(uid) {
    let arr = [];
    for(let i = 0, len = this._list.length; i < len; i++) {
      if(uid == this._list[i].uid) {
        arr.push(this._list[i]);
      }
    }

    return arr;
  },
  remove(id) {
    let result = false;
    let j = 0;
    for(let i = 0, len = this._list.length; i < len; i++) {
      if(this._list[i].id === id) {
        j = i;
        break;
      }
    }

    this._list.splice(j, 1);
    result = true;
    return result;
  }
}

module.exports = todoListController;