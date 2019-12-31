export default {
  props: {
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
  methods: {
    strengthManager() {
      return this.type === 'depth' || this.type === 'depth_inv'
        ? Math.abs(this.strength)
        : this.strength;
    },
  },
};
