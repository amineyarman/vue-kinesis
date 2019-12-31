<template>
  <component :is="tag" :style="{ ...transform, ...transformParameters }">
    <slot />
  </component>
</template>

<script>
export default {
  name: 'KinesisAudio',
  inject: ['context'],
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    type: {
      type: String,
      default: 'translate', // add scale, change rotate, translate, perspective, color, opacity, custom
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
      default: 20,
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
  },
  computed: {
    transform() {
      return this.transformAudio();
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
  },
  methods: {
    transformAudio() {
      const { audioData } = this.context;

      if (!this.context.audioData) return;

      const transformType = this.type;

      const { strength } = this;

      let amplitude; let
        transform;

      switch (transformType) {
        case 'translate':
          amplitude = audioData ? audioData[0][this.audioIndex] : 0;
          transform = `translate3d(${amplitude * strength}px, 0, 0)`;
          break;
        case 'rotate':
          amplitude = audioData ? audioData[0][this.audioIndex] : 0;
          transform = `rotate3d(0,0,1,${(amplitude * strength) / 10}deg)`;
          break;
        case 'scale':
          amplitude = audioData
            ? audioData[0][this.audioIndex] / strength < 1
              ? 1
              : audioData[0][this.audioIndex] / (strength * 2)
            : 1;
          transform = `scale(${amplitude})`;
          break;
      }

      return { transform };
    },
  },
};
</script>
