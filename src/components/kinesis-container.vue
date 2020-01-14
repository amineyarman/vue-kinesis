<template>
  <component
    :is="tag"
    @mousemove.stop="handleMovement"
    @mouseenter="handleMovementStart"
    @mouseleave="handleMovementStop"
    @click="handleClick"
    :style="style"
  >
    <slot></slot>
    <audio v-if="audio" type="audio/mpeg" @ended="ended" ref="audio">
      <source :src="audio" />
    </audio>
  </component>
</template>

<script>
import inViewport from '../utils/inViewport';
import isTouch from '../utils/isTouch';
import throttle from '../utils/throttle';
import baseMixin from '../mixins/base_mixin';
import perspectiveMixin from '../mixins/perspective_mixin';
import audioMixin from '../mixins/audio_mixin';

export default {
  name: 'KinesisContainer',
  mixins: [baseMixin, perspectiveMixin, audioMixin],
  provide() {
    const context = {};
    const providedProps = [
      'audioData',
      'cycleMovement',
      'duration',
      'easing',
      'event',
      'isMoving',
      'movement',
      'orientation',
      'scrollPosition',
    ];

    providedProps.forEach(prop => Object.defineProperty(context, prop, {
      enumerable: true,
      get: () => this[prop],
    }));

    return { context };
  },
  props: {
    event: {
      type: String,
      default: 'move', // move, scroll
    },
  },
  data() {
    return {
      pointer: {
        x: 0,
        y: 0,
      },
      clickPosition: {
        x: 0,
        y: 0,
      },
      movement: {
        x: 0,
        y: 0,
      },
      cycleMovement: {
        x: 0,
        y: 0,
      },
      scrollPosition: 0,
      orientation: {
        x: 0,
        y: 0,
        z: 0,
      },
      isMoving: false,
    };
  },
  mounted() {
    if (this.event === 'scroll') {
      window.addEventListener('scroll', this.handleScroll);
    }
    if (this.event === 'move' && this.isTouch) {
      window.addEventListener(
        'deviceorientation',
        this.handleOrientation,
        true,
      );
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener(
      'deviceorientation',
      this.handleOrientation,
      true,
    );
  },
  computed: {
    shape() {
      return this.$el.getBoundingClientRect();
    },
    center() {
      return this.getCoordinates(this.shape.width / 2, this.shape.height / 2);
    },
    isTouch() {
      return isTouch();
    },
  },
  watch: {
    type(newVal, oldVal) {
      if (newVal === 'scroll') {
        window.addEventListener('scroll', this.handleScroll);
      } else if (newVal === 'hover' && this.isTouch) {
        window.addEventListener(
          'deviceorientation',
          this.handleOrientation,
          true,
        );
      }
      if (oldVal === 'scroll') {
        window.removeEventListener('scroll', this.isInViewport);
      } else if (newVal === 'hover' && this.isTouch) {
        window.removeEventListener(
          'deviceorientation',
          this.handleOrientation,
          true,
        );
      }
    },
  },
  methods: {
    getCoordinates(x, y) {
      return { x, y };
    },
    // eslint-disable-next-line func-names
    handleMovement: throttle(function (event) {
      if (!this.active || this.event === 'scroll' || !this.isMoving) return;
      const { pointer } = this;
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      this.movementBehavior();
    }, 100),
    handleMovementStart() {
      this.isMoving = true;
    },
    handleMovementStop() {
      this.isMoving = false;
    },
    handleClick(event) {
      if (!this.active) return;
      const { clickPosition } = this;
      clickPosition.x = event.clientX;
      clickPosition.y = event.clientY;
    },
    movementBehavior() {
      const shape = this.$el.getBoundingClientRect();
      this.getCycleMovement(
        this.pointer.x,
        this.pointer.y,
        shape.width,
        shape.height,
        shape,
      );
      this.movement = this.getMovement(shape);
    },
    getMovement(shape) {
      const relativeX = this.pointer.x - shape.left;
      const relativeY = this.pointer.y - shape.top;

      const movementX = relativeX / this.center.x;
      const movementY = relativeY / this.center.y;

      return { x: movementX, y: movementY };
    },
    getCycleMovement(xPos, yPos, width, height, shape) {
      const x = ((xPos - shape.left) * (Math.PI * 2)) / width;
      const y = ((yPos - shape.top) * (Math.PI * 2)) / height;

      this.cycleMovement = {
        x, y, width, height,
      };
    },
    handleScroll: throttle(
      function () {
        if (!this.active || this.event === 'move') return;
        const shape = this.$el.getBoundingClientRect();
        const isInViewport = inViewport(shape);

        if (this.event === 'scroll' && isInViewport && !!shape.height) {
          this.getCycleMovement(
            0,
            0,
            window.innerWidth,
            window.innerHeight,
            shape,
          );
          this.scrollPosition = (shape.top - window.innerHeight)
            / (shape.height + window.innerHeight);
        }
      },
      19,
      'scroll',
    ),
    handleOrientation: throttle(function (event) {
      if (!this.active) return;
      const shape = this.$el.getBoundingClientRect();
      const isInViewport = inViewport(shape);
      if (this.event === 'move' && isInViewport) {
        const x = event.gamma / 45;
        const y = event.beta / 90;
        this.orientation = { x, y };
      }
    }, 100),
  },
};
</script>
