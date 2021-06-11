<script>
import elementMovement from '../utils/elementMovement'
import transformMixin from '../mixins/transform_mixin'
import cyclicMovement from '../utils/cyclicMovement'

export default {
  name: 'KinesisElement',
  mixins: [transformMixin],
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    type: {
      type: String,
      default: 'translate', // translate, rotate, scale, scaleX, scaleY, depth, depth_inv, custom
    },
    transformOrigin: {
      type: String,
      default: 'center',
    },
    originX: {
      type: Number,
      default: 50,
    },
    originY: {
      type: Number,
      default: 50,
    },
    strength: {
      type: Number,
      default: 10,
    },
    axis: {
      type: String,
      default: null,
    },
    maxX: {
      type: Number,
      default: null,
    },
    maxY: {
      type: Number,
      default: null,
    },
    minX: {
      type: Number,
      default: null,
    },
    minY: {
      type: Number,
      default: null,
    },
    cycle: {
      type: Number,
      default: 0,
    },
  },
  inject: ['context'],
  computed: {
    transform() {
      return this.transformCalculation()
    },
    transformParameters() {
      return {
        transitionProperty: 'transform',
        transitionDuration: this.transitionDuration,
        transformOrigin: this.transformOrigin,
        transitionTimingFunction: this.transitionTimingFunction,
      }
    },
    transitionDuration() {
      const { duration, } = this.context
      return `${duration}ms`
    },
    transitionTimingFunction() {
      return this.context.easing
    },
  },
  methods: {
    transformCalculation() {
      const { context, } = this

      if (
        !context.shape
        || (!context.isMoving
        && context.event === 'move')
      ) return {}

      let movementX
      let movementY

      const { x, y, } = this.cycle < 1
        ? elementMovement({
          ...context.movement,
          originX: this.originX,
          originY: this.originY,
          strength: this.strengthManager(),
          event: context.event,
          minX: this.minX,
          minY: this.minY,
          maxX: this.maxX,
          maxY: this.maxY,
        })
        : cyclicMovement({
          referencePosition: context.event === 'scroll' ? { x: 0, y: 0, } : context.eventData,
          shape: context.shape,
          event: context.event,
          cycles: this.cycle,
          strength: this.strengthManager(),
        })

      if (context.event !== 'scroll') {
        movementX = this.axis === 'y' ? 0 : x
        movementY = this.axis === 'x' ? 0 : y
      } else if (context.event === 'scroll') {
        movementX = this.axis === 'x' ? y : 0
        movementY = this.axis === 'y' || !this.axis ? y : 0
      } else if (this.cycle > 0) {
        movementX = this.axis === 'x' ? x : 0
        movementY = this.axis === 'y' ? y : 0
      }

      return {
        transform: this.transformSwitch(this.type, movementX, movementY, this.strength),
      }
    },
    strengthManager() {
      return this.type === 'depth' || this.type === 'depth_inv'
        ? Math.abs(this.strength)
        : this.strength
    },
  },
  render(createElement) {
    const context = this
    return createElement(
      context.tag,
      {
        style: { ...context.transform, ...context.transformParameters, },
      },
      context.$slots.default
    )
  },
}
</script>
