<template>
  <component
    :is="tag"
    :style="style"
    @mousemove="handleMovement"
    @mouseenter="handleMovementStart"
    @mouseleave="handleMovementStop"
  >
    <slot />
    <audio
      v-if="audio"
      ref="audio"
      type="audio/mpeg"
      @ended="stop"
    >
      <source :src="audio">
    </audio>
  </component>
</template>

<script>
import mouseMovement from '../utils/mouseMovement'
import scrollMovement from '../utils/scrollMovement'
import orientationElement from '../utils/orientationElement'
import inViewport from '../utils/inViewport'
import isTouch from '../utils/isTouch'
import getCoordinates from '../utils/getCoordinates'
import throttle from '../utils/throttle'
import audioMixin from '../mixins/audio_mixin'

export default {
  name: 'KinesisContainer',
  mixins: [audioMixin],
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    event: {
      type: String,
      default: 'move',
    },
    active: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 1000,
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
  provide() {
    const context = {}
    const providedProps = [
      'audioData',
      'duration',
      'easing',
      'event',
      'eventData',
      'isMoving',
      'movement',
      'shape',
    ]

    providedProps.forEach((prop) => Object.defineProperty(context, prop, {
      enumerable: true,
      get: () => this[prop],
    }))

    return { context, }
  },
  data() {
    return {
      shape: this.$el?.getBoundingClientRect(),
      isMoving: false,
      leftOnce: false,
      movement: {
        x: 0,
        y: 0,
      },
      eventMap: {
        orientation: 'deviceorientation',
        scroll: 'scroll',
        move: isTouch() ? 'deviceorientation' : null,
      },
    }
  },
  computed: {
    eventActions() {
      return {
        move: {
          action: mouseMovement,
          condition: this.isMoving && !isTouch(),
          type: isTouch() ? 'deviceorientation' : null,
        },
        scroll: {
          action: scrollMovement,
          condition: !!this.shape?.height,
          type: 'scroll',
        },
        orientation: {
          action: orientationElement,
          condition: this.event === 'move' && isTouch(),
          type: 'deviceorientation',
        },
      }
    },
    style() {
      return { perspective: `${this.perspective}px`, }
    },
  },
  mounted() {
    this.addEvents()
  },
  beforeDestroy() {
    this.removeEvents()
  },
  methods: {
    handleMovementStart() {
      if (!this.active) return
      this.isMoving = true
    },
    handleMovementStop() {
      if (!this.active) return
      // fixes the specific case when mouseenter didn't trigger on page refresh
      this.leftOnce = true
      this.isMoving = false
    },
    // eslint-disable-next-line func-names
    handleMovement: throttle(function (event) {
      if (!this.active) return
      if (!this.isMoving && !this.leftOnce) {
        // fixes the specific case when mouseenter didn't trigger on page refresh
        this.handleMovementStart()
      }

      this.shape = this.$el.getBoundingClientRect()
      const isInViewport = inViewport(this.shape)
      const eventCondition = this.eventActions[this.event].condition

      const eventAction = this.eventActions[this.event].action

      if (isInViewport && eventCondition) {
        this.movement = eventAction({
          target: this.shape,
          event,
        })
        this.eventData = getCoordinates(event.clientX, event.clientY)
      }
    }, 100),
    addEvents() {
      if (this.eventMap[this.event]) {
        window.addEventListener(
          this.eventMap[this.event],
          this.handleMovement,
          true,
        )
      }
    },
    removeEvents() {
      if (this.eventMap[this.event]) {
        window.removeEventListener(
          this.eventMap[this.event],
          this.handleMovement,
          true,
        )
      }
    },
  },
}
</script>
