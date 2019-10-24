<template>
  <component
    :is="tag"
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
  provide() {
    const context = {};

    Object.defineProperty(context, 'mousePosition', {
      enumerable: true,
      get: () => this.mousePosition,
    });

    Object.defineProperty(context, 'isHovering', {
      enumerable: true,
      get: () => this.isHovering,
    });

    Object.defineProperty(context, 'isHoverable', {
      enumerable: true,
      get: () => this.isHoverable,
    });

    Object.defineProperty(context, 'didEnter', {
      enumerable: true,
      get: () => this.didEnter,
    });

    Object.defineProperty(context, 'animationDuration', {
      enumerable: true,
      get: () => this.animationDuration,
    });

    Object.defineProperty(context, 'easing', {
      enumerable: true,
      get: () => this.easing,
    });

    Object.defineProperty(context, 'shape', {
      enumerable: true,
      get: () => this.shape,
    });

    return { context };
  },
  data() {
    return {
      mousePosition: {
        x: 0,
        y: 0,
      },
      isHovering: false,
      isHoverable: false,
      attemptedHover: false,
      didEnter: false,
      shape: null,
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
  mounted() {
    this.shape = this.$el.getBoundingClientRect();
    setTimeout(() => {
      this.isHoverable = true;
      if (this.attemptedHover) {
        this.parallaxStart();
      }
    }, 100);
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
      this.shape = this.$el.getBoundingClientRect();
      this.mousePosition.x = event.clientX;
      this.mousePosition.y = event.clientY;
    }, 100),

    parallaxStart() {
      this.attemptedHover = true;
      if (this.isHoverable) {
        this.isHovering = true;
        this.didEnter = false;
        setTimeout(() => {
          this.didEnter = true;
        }, 1000);
      }
    },

    parallaxStop() {
      this.isHovering = false;
      this.didEnter = false;
    },
  },
};
</script>
