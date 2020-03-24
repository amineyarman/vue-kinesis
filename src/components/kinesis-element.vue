<template>
  <component :is="tag" :style="{ ...transform, ...transformParameters }">
    <slot />
  </component>
</template>

<script>
import isTouch from '../utils/isTouch';
import motionMixin from '../mixins/motion_mixin';
import transformMixin from '../mixins/transform_mixin';
import elementMovement from '../utils/elementMovement';
import clamp from '../utils/clamp';
import cyclicMovement from '../utils/cyclicMovement';

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
    getContext() {
      return this.context;
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

      let movementX; let movementY;

      const eventTrigger = context.event;

      const strength = this.strengthManager();

      if (this.cycle <= 0) {
        const { x, y } = elementMovement({
          ...context.movement,
          originX: this.originX,
          originY: this.originY,
          strength,
        });

        const isScroll = eventTrigger === 'scroll';
        if (!isScroll) {
          movementX = this.axis === 'y' ? 0 : clamp(x, this.minX, this.maxX);
          movementY = this.axis === 'x' ? 0 : clamp(y, this.minY, this.maxY);
        }

        if (isScroll) {
          const scrollMovement = elementMovement({
            x: context.movement.x,
            y: context.movement.y,
            originX: this.originX,
            originY: this.originY,
            strength,
            event: context.event,
          }).y;

          movementX = this.axis === 'x' ? scrollMovement : 0;
          movementY = this.axis === 'y' || !this.axis ? scrollMovement : 0;
        }
      } else if (this.cycle > 0) {
        const { shape, eventData } = context;
        if (shape) {
          const cycleX = this.axis === 'x'
            ? cyclicMovement({
              referencePosition:
                    eventTrigger === 'scroll' ? 0 : eventData.x,
              elementPosition: shape.left,
              spanningRange:
                    eventTrigger === 'scroll' ? window.innerWidth : shape.width,
              cycles: this.cycle,
            })
            : 0;
          const cycleY = this.axis === 'y' || !this.axis
            ? cyclicMovement({
              referencePosition:
                    eventTrigger === 'scroll' ? 0 : eventData.y,
              elementPosition: shape.top,
              spanningRange:
                    eventTrigger === 'scroll'
                      ? window.innerHeight
                      : shape.height,
              cycles: this.cycle,
            })
            : 0;

          movementX = cycleX * strength;
          movementY = cycleY * strength;
        }
      }

      let transformType = this.type;

      transformType = transformType === 'scaleX' || transformType === 'scaleY'
        ? 'scale'
        : transformType;

      const transform = this.transformSwitch(
        transformType,
        movementX,
        movementY,
        this.strength,
      );

      return { transform };
    },
  },
};
</script>
