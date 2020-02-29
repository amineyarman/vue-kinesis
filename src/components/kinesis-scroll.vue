<template>
  <component :is="tag" :style="{ ...transform, ...transformParameters }">
    <slot
  /></component>
</template>

<script>
import inViewport from '../utils/inViewport';
import throttle from '../utils/throttle';
import baseMixin from '../mixins/base_mixin';

import perspectiveMixin from '../mixins/perspective_mixin';
import motionMixin from '../mixins/motion_mixin';
import transformMixin from '../mixins/transform_mixin';

export default {
  name: 'KinesisScroll',
  mixins: [baseMixin, perspectiveMixin, motionMixin, transformMixin],
  data() {
    return {
      transform: {},
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, { passive: true });
  },
  computed: {
    transformParameters() {
      return {
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
    getCycleMovement(xPos, yPos, width, height, shape) {
      const x = ((xPos - shape.left) * (Math.PI * 2)) / width;
      const y = ((yPos - shape.top) * (Math.PI * 2)) / height;

      this.cycleMovement = {
        x, y, width, height,
      };
    },
    handleScroll: throttle(
      // eslint-disable-next-line func-names
      function () {
        if (!this.active) return;
        const shape = this.$el.getBoundingClientRect();
        const isInViewport = inViewport(shape);
        if (isInViewport && !!shape.height) {
          this.transformBehavior(shape);
        }
      },
      19,
      'scroll',
    ),
    transformBehavior(shape) {
      let movementX; let movementY;
      const scrollPosition = (shape.top - window.innerHeight) / (shape.height + window.innerHeight);
      if (this.cycle <= 0) {
        const scrollMovement = scrollPosition * this.strength;

        movementX = this.axis === 'x' ? scrollMovement : 0;
        movementY = this.axis === 'y' || !this.axis ? scrollMovement : 0;

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
        } = this.getCycleMovement(
          0,
          0,
          window.innerWidth,
          window.innerHeight,
          shape,
        );
        const cycleX = width * Math.sin(x * this.cycle);
        const cycleY = height * Math.sin(y * this.cycle);

        movementX = this.axis === 'x' ? (cycleX / (width / 2)) * this.strength : 0;
        movementY = this.axis === 'y' || !this.axis
          ? (cycleY / (height / 2)) * this.strength
          : 0;
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
      this.transform = { transform };
    },
  },
};
</script>
