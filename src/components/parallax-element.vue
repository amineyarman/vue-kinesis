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
  },
  computed: {
    parent() {
      return this.$parent;
    },
    isHovering() {
      return this.parent.isHovering;
    },
    mousePosition() {
      return this.parent.mousePosition;
    },
    transform() {
      if (!this.parent.isHovering) return;
      const shape = this.$el ? this.parent.shape : { top: 0, left: 0 };
      const parallaxStrength = this.type === 'depth' ? Math.abs(this.parallaxStrength) : this.parallaxStrength;
      const relativeX = this.mousePosition.x - shape.left;
      const relativeY = this.mousePosition.y - shape.top;
      const movementX = ((relativeX - shape.width / 2) / (shape.width / 2)) * parallaxStrength;
      const movementY = ((relativeY - shape.height / 2) / (shape.height / 2)) * parallaxStrength;

      let transform;
      if (this.type === 'translation') {
        transform = `translateX(${-movementX}px) translateY(${-movementY}px)`;
      } else if (this.type === 'rotation') {
        const movement = movementX + movementY;
        transform = `rotateZ(${movement}deg)`;
      } else if (this.type === 'depth') {
        transform = `rotateX(${-movementY}deg) rotateY(${movementX}deg) translateZ(${this.parallaxStrength * 2}px) `;
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
      const { animationDuration } = this.parent;
      const durationException = animationDuration > 400 ? animationDuration : 400;
      const duration = this.parent.didEnter ? animationDuration : durationException;
      return `${duration}ms`;
    },
    transitionTimingFunction() {
      return this.parent.easing;
    },
  },
};
</script>
