export default function throttle(callback, delay) {
  let last;
  let timer;
  // eslint-disable-next-line func-names
  return function () {
    const context = this;
    const newDelay = this.animationDuration > 1000 ? delay : this.animationDuration / 10;
    const now = +new Date();
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    if (last && now < last + newDelay) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        callback.apply(context, args);
      }, newDelay);
    } else {
      last = now;
      callback.apply(context, args);
    }
  };
}
