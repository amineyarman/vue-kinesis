<template>
  <component :is="tag" :style="{ ...transform, ...transformParameters }">
    <slot />
  </component>
</template>

<script>
import isTouch from '../utils/isTouch';
import motionMixin from '../mixins/motion_mixin';
import transformMixin from '../mixins/transform_mixin';

export default {
  name: 'KinesisElement',
  mixins: [motionMixin, transformMixin],
  inject: ['context'],
  props: {
    tag: {
      type: String,
      default: 'div',
    },
  },
  computed: {
    transform() {
      return this.transformMovement();
    },
    transformParameters() {
      return {
        transitionProperty: 'transform',
        transitionDuration: this.transitionDuration,
        transformOrigin: this.transformOrigin,
        transitionTimingFunction: this.transitionTimingFunction,
      };
    },
    transitionDuration() {
      const { duration } = this.context;
      return `${duration}ms`;
    },
    transitionTimingFunction() {
      return this.context.easing;
    },
    isTouch() {
      return isTouch();
    },
  },
  methods: {
    transformMovement() {
      const { context } = this;

      if (!context.isMoving && context.event === 'move') return {};

      let movementX;
      let movementY;

      const eventTrigger = context.event;

      const strength = this.strengthManager();

      if (this.cycle <= 0) {
        const { x, y } = !this.isTouch ? context.movement : context.orientation;

        const isScroll = eventTrigger === 'scroll';

        if (!isScroll) {
          const originX = this.isTouch ? 0 : this.originX;
          const originY = this.isTouch ? 0 : this.originY;

          movementX = this.axis === 'y' ? 0 : (x - originX / 50) * strength;
          movementY = this.axis === 'x' ? 0 : (y - originY / 50) * strength;
        }

        if (isScroll) {
          const scrollMovement = context.scrollPosition * strength;

          movementX = this.axis === 'x' ? scrollMovement : 0;
          movementY = this.axis === 'y' || !this.axis ? scrollMovement : 0;
        }

        if (this.maxX) {
          movementX = Math.min(movementX, this.maxX);
        }
        if (this.minX) {
          movementX = Math.max(movementX, this.minX);
        }
        if (this.maxY) {
          movementY = Math.min(movementY, this.maxY);
        }
        if (this.minY) {
          movementY = Math.max(movementY, this.minY);
        }
      } else if (this.cycle > 0) {
        const {
          x, y, width, height,
        } = context.cycleMovement;
        const cycleX = width * Math.sin(x * this.cycle);
        const cycleY = height * Math.sin(y * this.cycle);

        movementX = this.axis === 'x' ? (cycleX / (width / 2)) * strength : 0;
        movementY = this.axis === 'y' || !this.axis ? (cycleY / (height / 2)) * strength : 0;
      }

      let transformType = this.type;

      transformType = transformType === 'scaleX' || transformType === 'scaleY' ? 'scale' : transformType;

      const transform = this.transformSwitch(transformType, movementX, movementY, this.strength);
      return { transform };
    },
  },
};
</script>
