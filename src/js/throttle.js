export default function throttle(callback, delay) {
  var last;
  var timer;
  return function () {
      var context = this;
      var now = +new Date();
      var args = arguments;
      if (last && now < last + delay) {
          clearTimeout(timer);
          timer = setTimeout(function () {
              last = now;
              callback.apply(context, args);
          }, delay);
      } else {
          last = now;
          callback.apply(context, args);
      }
  };
}