export default {
  props: {
    active: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 1000,
    },
    easing: {
      type: String,
      default: 'cubic-bezier(0.23, 1, 0.32, 1)',
    },
    tag: {
      type: String,
      default: 'div',
    },
  },
};
