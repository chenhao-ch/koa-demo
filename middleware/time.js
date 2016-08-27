

module.exports = function(app) {
 
  app.context.__defineGetter__('time', function() {
    var t = this._time;
    if(t) {
      return t;
    }

    this._time = new Time();
    return this._time;
  });

  app.context.__defineSetter__('time', function() {
    this._time = new Time();
  });

  function Time() {

  }
  Time.prototype.start = function(name) {
    console.time(name);
  };
  Time.prototype.end = function(name) {
    console.timeEnd(name);
  };


  return function* (next) {
    const path = this.path;
    const timeName = `__time__${path}`;
    console.time(timeName);
    yield* next;
    console.timeEnd(timeName);
  };
};
