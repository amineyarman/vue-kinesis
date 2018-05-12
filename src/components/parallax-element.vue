<template>
  <div ref="parallaxSection" class="parallax-element" :style="transformParallax">
      <slot></slot>
  </div>
</template>

<script>

import getPosition from '../js/getPosition'

export default {
  props: ["parallaxStrength", "isHover", "type"],

  mounted() {
    this.width = this.$refs.parallaxSection.offsetWidth;
    this.height = this.$refs.parallaxSection.offsetHeight;
    this.offsetX = parseInt(this.$refs.parallaxSection.offsetLeft);
    this.offsetY = parseInt(this.$refs.parallaxSection.getBoundingClientRect().top + document.documentElement.scrollTop);
    this.$emit('parallaxStrengthValue', this.parallaxStrength);
  },

  data() {
    return {
      width: 0,
      height: 0,
      offsetX: 0,
      offsetY: 0,
      movementX: 0,
      movementY: 0,
      isHovering: false
    };
  },

  computed: {
    transformParallax() {
      let mouseX = this.$parent.mouseX;
      let mouseY = this.$parent.mouseY;
      if (this.isHovering === false) {
        return;
      } else if (this.type === "translation") {
        let relX = mouseX - getPosition(this.$refs.parallaxSection).x;
        let relY = mouseY - getPosition(this.$refs.parallaxSection).y;
        this.movementX =
          (relX - this.width / 2) / this.width * this.parallaxStrength;
        this.movementY =
          (relY - this.height / 2) / this.height *this.parallaxStrength;
        return {
          transform: `translateX(${this.movementX}px) translateY(${
            this.movementY
          }px)`
        };
      } else if (this.type === "rotation") {
        let relX =
          mouseX - getPosition(this.$refs.parallaxSection).x;
        let relY =
          mouseY - getPosition(this.$refs.parallaxSection).y;
        this.movementX =
          (relX - this.width / 2) / this.width * this.parallaxStrength;
        this.movementY =
          (relY - (this.height/2)) / this.height * this.parallaxStrength;
          let movement = (this.movementX) + (this.movementY)
        return {
          transform: `rotateZ(${movement}deg)`
        };
      } else if (this.type === "depth") {
        let relX =
          mouseX - getPosition(this.$refs.parallaxSection).x;
        let relY =
          mouseY - getPosition(this.$refs.parallaxSection).y;
        this.movementX =
          (relX - this.width / 2) /
          this.width *
          Math.abs(this.parallaxStrength);
        this.movementY =
          (relY - (this.height/1.5)) /
          this.height *
          Math.abs(this.parallaxStrength);
        return {
          transform: `rotateX(${-this.movementY}deg) rotateY(${
            this.movementX
          }deg) translateZ(${this.parallaxStrength * 2}px) `
        };
      }
    }
  },
  created() {
  }
};
</script>

<style lang="scss" scoped>
.parallax-element {
  transform-origin: center;
  transition: all 2s;
  transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
}
</style>