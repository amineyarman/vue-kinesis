<template>
  <component :is="tag" :style="{ ...transform, ...transformParameters }">
    <slot />
  </component>
</template>

<script>
import motionMixin from '../mixins/motion_mixin';

export default {
  name: 'KinesisAudio',
  inject: ['context'],
  mixins: [motionMixin],
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    audioIndex: {
      type: Number,
      default: 50,
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

      // eslint-disable-next-line default-case
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
          // eslint-disable-next-line no-nested-ternary
          amplitude = audioData
            ? audioData[0][this.audioIndex] / strength < 1
              ? 1
              : audioData[0][this.audioIndex] / (strength * 2)
            : 1;
          transform = `scale(${amplitude})`;
          break;
      }

      // eslint-disable-next-line consistent-return
      return { transform };
    },
  },
};
</script>
