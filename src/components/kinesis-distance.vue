<template>
  <component :is="tag" :style="{ ...transform, ...transformParameters }">
    <slot />
  </component>
</template>

<script>
import throttle from '../utils/throttle';

export default {
  name: 'KinesisDistance',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    type: {
      type: String,
      default: 'translate', // translate, rotate, scale, scaleX, scaleY, depth, custom
    },
    transformOrigin: {
      type: String,
      default: 'center',
    },
    originX: {
      type: Number,
      default: 50,
    },
    originY: {
      type: Number,
      default: 50,
    },
    strength: {
      type: Number,
      default: 10,
    },
    axis: {
      type: String,
      default: null,
    },
    maxX: {
      type: Number,
      default: null,
    },
    maxY: {
      type: Number,
      default: null,
    },
    minX: {
      type: Number,
      default: null,
    },
    minY: {
      type: Number,
      default: null,
    },
    distance: {
      type: Number,
      default: 100,
    },
    cycle: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 1001,
    },
    easing: {
      type: String,
      default: 'cubic-bezier(0.23, 1, 0.32, 1)',
    },
    perspective: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      pointer: {
        x: 0,
        y: 0,
      },
      transform: {},
      component: 'kidistance',
      throttle: 500,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleMovement);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleMovement);
  },
  computed: {
    style() {
      return { perspective: `${this.perspective}px` };
    },
    transformParameters() {
      return {
        position: 'relative',
        transitionProperty: 'transform',
        transitionDuration: this.transitionDuration,
        transformOrigin: this.transformOrigin,
        transitionTimingFunction: this.easing,
      };
    },
    transitionDuration() {
      return `${this.duration}ms`;
    },
  },
  methods: {
    getCoordinates(x, y) {
      const shape = this.$el.getBoundingClientRect();
      return { x: x + shape.left, y: y + shape.top };
    },
    getDistance(x1, x2, y1, y2) {
      return Math.floor(Math.hypot(x2 - x1, y2 - y1));
    },
    // eslint-disable-next-line func-names
    handleMovement: throttle(function (event) {
      window.addEventListener('mousemove', this.handleMovement);

      const { pointer } = this;
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      this.transformBehavior();
    }, 50),
    transformBehavior() {
      const shape = this.$el.getBoundingClientRect();

      const center = this.getCoordinates(shape.width / 2, shape.height / 2);
      const distance = this.getDistance(
        this.pointer.x,
        center.x,
        this.pointer.y,
        center.y,
      );

      if (distance > this.distance) {
        this.transform = {};
        this.throttle = 500;

        return;
      }
      this.throttle = 50;

      const transform = `scale(${distance / this.distance})`;

      // Add radius from which the transfrom will start

      this.transform = { transform };
    },
    scaleMovement(x, y) {
      const { type } = this;
      const movement = (Math.sign(this.strength) * (Math.abs(x) + Math.abs(y))) / 10 + 1;
      return `scale3d(${type === 'scaleX' || type === 'scale' ? movement : 1},
      ${type === 'scaleY' || type === 'scale' ? movement : 1},
      1)`;
    },
  },
};
</script>
