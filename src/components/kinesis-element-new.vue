<script>
import elementMovement from '../utils/elementMovement'
import clamp from '../utils/clamp'
import transformMixin from '../mixins/transform_mixin'

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
    audioIndex: {
      type: Number,
      default: 50,
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

      if (!context.isMoving && context.event === 'move') return {}

      let movementX; let movementY

      let { x, y, } = elementMovement({
        ...context.movement,
        originX: this.originX,
        originY: this.originY,
        strength: this.strengthManager(),
        event: context.event,
      })

      x = clamp(x, this.minX, this.maxX)
      y = clamp(y, this.minY, this.maxY)

      if (context.event !== 'scroll') {
        movementX = this.axis === 'y' ? 0 : x
        movementY = this.axis === 'x' ? 0 : y
      }
      if (context.event === 'scroll') {
        movementX = this.axis === 'x' ? y : 0
        movementY = this.axis === 'y' || !this.axis ? y : 0
      }

      return {
        transform: this.transformSwitch(
          this.type,
          movementX,
          movementY,
          this.strength,
        ),
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
      context.$slots.default,
    )
  },
}
</script>
