<template>
  <component :is="tag"
    @mousemove="getMousePosition"
    @mouseleave="parallaxStop"
    @mouseenter="parallaxStart"
    :style="{perspective: `${perspective}px`}"
  >
    <slot></slot>
  </component>
</template>

<script>
import throttle from '../lib/throttle';

export default {
  name: 'ParallaxContainer',
  data() {
    return {
      mousePosition: {
        x: 0,
        y: 0,
      },
      isHovering: false,
      didEnter: false,
    };
  },
  props: {
    animationDuration: {
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
    perspective: {
      type: Number,
      default: 1000,
    },
  },
  methods: {
    getRelativePosition() {
      const shape = this.$el.getBoundingClientRect();
      return {
        top: shape.top,
        left: shape.left,
      };
    },
    // eslint-disable-next-line func-names
    getMousePosition: throttle(function (event) {
      this.mousePosition.x = event.clientX;
      this.mousePosition.y = event.clientY;
    }, 100),

    parallaxStart() {
      this.isHovering = true;
      this.didEnter = false;
      setTimeout(() => {
        this.didEnter = true;
      }, 1000);
    },

    parallaxStop() {
      this.isHovering = false;
      this.didEnter = false;
    },
  },
};
</script>
