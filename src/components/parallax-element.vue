<template>
  <component :is="tag" :style="{...transform, ...transformParameters}">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'ParallaxElement',
  props: {
    parallaxStrength: {
      type: Number,
      default: 10,
    },
    type: {
      type: String,
      default: 'translation',
    },
    tag: {
      type: String,
      default: 'div',
    },
    limitX: {
      type: Boolean,
      default: false,
    },
    limitY: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['context'],
  computed: {
    transform() {
      const { isHovering, mousePosition, shape } = this.context;

      if (!isHovering) return;

      const parallaxStrength = this.type === 'depth' ? Math.abs(this.parallaxStrength) : this.parallaxStrength;
      const relativeX = mousePosition.x - shape.left;
      const relativeY = mousePosition.y - shape.top;
      const movementX = ((relativeX - shape.width / 2) / (shape.width / 2)) * parallaxStrength;
      const movementY = ((relativeY - shape.height / 2) / (shape.height / 2)) * parallaxStrength;

      let transform;
      if (this.type === 'translation') {
        transform = `translate3d(${this.limitY ? 0 : -movementX}px, ${this.limitX ? 0 : -movementY}px, 0)`;
      } else if (this.type === 'rotation') {
        let movement;
        if (this.limitX) {
          movement = movementX * 2;
        } else if (this.limitY) {
          movement = movementY * 2;
        } else {
          movement = movementX + movementY;
        }
        transform = `rotate3d(0,0,1,${movement}deg)`;
      } else if (this.type === 'depth') {
        transform = `rotateX(${this.limitX ? 0 : -movementY}deg) rotateY(${this.limitY ? 0 : movementX}deg) translate3d(0,0,${this.parallaxStrength * 2}px)`;
      }
      // eslint-disable-next-line consistent-return
      return { transform };
    },
    transformParameters() {
      return {
        transitionProperty: 'transform',
        transitionDuration: this.transitionDuration,
        transformOrigin: 'center',
        transitionTimingFunction: this.transitionTimingFunction,
      };
    },
    transitionDuration() {
      const { animationDuration, didEnter } = this.context;
      const durationException = animationDuration > 400 ? animationDuration : 400;
      const duration = didEnter ? animationDuration : durationException;
      return `${duration}ms`;
    },
    transitionTimingFunction() {
      return this.context.easing;
    },
  },
};
</script>
