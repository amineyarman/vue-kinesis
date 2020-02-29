import isTouch from '../utils/isTouch';

export default {
  props: {
    event: {
      type: String,
      default: 'move', // move, scroll
    },
  },
  data() {
    return {
      eventMap: {
        orientation: 'deviceorientation',
        scroll: 'scroll',
        move: isTouch() ? 'deviceorientation' : null,
      },
    };
  },
  methods: {
    addEvents() {
      if (this.eventMap[this.event]) {
        window.addEventListener(
          this.eventMap[this.event],
          this.handleMovement,
          true,
        );
      }
    },
    removeEvents() {
      if (this.eventMap[this.event]) {
        window.removeEventListener(
          this.eventMap[this.event],
          this.handleMovement,
          true,
        );
      }
    },
  },
  watch: {
    event(newVal, oldVal) {
      if (this.eventMap[newVal]) {
        window.addEventListener(
          this.eventMap[newVal],
          this.handleMovement,
          true,
        );
      }
      if (this.eventMap[oldVal]) {
        window.addEventListener(
          this.eventMap[oldVal],
          this.handleMovement,
          true,
        );
      }
    },
  },
};
