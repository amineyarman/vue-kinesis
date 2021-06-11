<template>
  <component
    :is="tag"
    @mousemove="handleMovement"
    @mouseenter="handleMovementStart"
    @mouseleave="handleMovementStop"
    :style="style"
  >
    <slot></slot>
    <audio v-if="audio" type="audio/mpeg" @ended="stop" ref="audio">
      <source :src="audio" />
    </audio>
  </component>
</template>

<script>
import inViewport from "../utils/inViewport";
import throttle from "../utils/throttle";
import baseMixin from "../mixins/base_mixin";
import perspectiveMixin from "../mixins/perspective_mixin";
import audioMixin from "../mixins/audio_mixin";
import containerEvents from "../mixins/container_events";
import mouseMovement from "../utils/mouseMovement";
import orientationElement from "../utils/orientationElement";
import scrollMovement from "../utils/scrollMovement";
import getCoordinates from "../utils/getCoordinates";
import isTouch from "../utils/isTouch";

export default {
  name: "KinesisContainer",
  mixins: [baseMixin, perspectiveMixin, audioMixin, containerEvents],
  provide() {
    const context = {};
    const providedProps = [
      "audioData",
      "duration",
      "easing",
      "event",
      "eventData",
      "isMoving",
      "movement",
      "shape",
    ];

    providedProps.forEach((prop) =>
      Object.defineProperty(context, prop, {
        enumerable: true,
        get: () => this[prop],
      })
    );

    return { context };
  },
  data() {
    return {
      movement: {
        x: 0,
        y: 0,
      },
      isMoving: false,
      shape: null,
      leftOnce: false,
      eventData: {
        x: 0,
        y: 0,
      },
    };
  },
  mounted() {
    this.addEvents();
  },
  beforeUnmount() {
    this.removeEvents();
  },
  methods: {
    // eslint-disable-next-line func-names
    handleMovement: throttle(function (event) {
      if (!this.active) return;

      if (!this.isMoving && !this.leftOnce) {
        // fixes the specific case when mouseenter didn't trigger on page refresh
        this.isMoving = true;
      }

      this.shape = this.$el.getBoundingClientRect();
      const isInViewport = inViewport(this.shape);

      if (this.event === "move" && this.isMoving && !isTouch()) {
        this.movement = mouseMovement({
          target: this.shape,
          event,
        });
        this.eventData = getCoordinates(event.clientX, event.clientY);
      } else if (
        (this.event === "orientation" ||
          (this.event === "move" && isTouch())) &&
        isInViewport
      ) {
        this.movement = orientationElement({
          target: this.shape,
          event,
        });
      } else if (
        this.event === "scroll" &&
        isInViewport &&
        !!this.shape.height
      ) {
        this.movement = scrollMovement(this.shape);
      }
    }, 100),
    handleMovementStart() {
      if (!this.active) return;
      this.isMoving = true;
    },
    handleMovementStop() {
      if (!this.active) return;
      // fixes the specific case when mouseenter didn't trigger on page refresh
      this.leftOnce = true;
      this.isMoving = false;
    },
  },
};
</script>
