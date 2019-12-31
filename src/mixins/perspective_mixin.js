export default {
  props: {
    perspective: {
      type: Number,
      default: 1000,
    },
  },
  computed: {
    style() {
      return { perspective: `${this.perspective}px` };
    },
  },
};
