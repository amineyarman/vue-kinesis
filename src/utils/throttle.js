export default function throttle(callback, delay, type) {
  let last;
  let timer;
  // eslint-disable-next-line func-names
  return function () {
    const context = this;
    let newDelay;
    if (type === 'scroll') {
      newDelay = delay;
    } else {
      newDelay = context.duration > 1000 ? delay : context.duration / 10;
    }

    const now = +new Date();
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    if (last && now < last + newDelay) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        requestAnimationFrame(() => {
          last = now;
          callback.apply(context, args);
        });
      }, newDelay);
    } else {
      requestAnimationFrame(() => {
        last = now;
        callback.apply(context, args);
      });
    }
  };
}
