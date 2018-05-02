<template>
  <div ref="parallaxSection" class="parallax-element" :style="transformParallax">
      <slot></slot>
  </div>
</template>

<script>
export default {
    props: ['parallaxStrength', 'mousePX', 'mousePY', 'parallaxType'],
    mounted(){
    this.width = this.$refs.parallaxSection.offsetWidth;
    this.height = this.$refs.parallaxSection.offsetHeight;
    this.offsetX = this.$refs.parallaxSection.offsetLeft;
    this.offsetY = this.$refs.parallaxSection.offsetTop;
  },
  data() {
    return {
      width: 0,
      height: 0,
      mouseX: 0,
      mouseY: 0,
      offsetX: 0,
      offsetY: 0,
      movementX: 0
    }
  },
  computed: {
      transformParallax(){
          this.mouseX = this.mousePX;
          this.mouseY = this.mousePY;
          let relX = this.mouseX - this.offsetX
          let relY = this.mouseY - this.offsetY
          this.movementX = (relX - this.width/2) / this.width * this.parallaxStrength
          this.movementY = (relY - this.height/2) / this.height * this.parallaxStrength
          
          if (this.parallaxType === 'translation') {
            return {
                transform: `translateX(${this.movementX}px) translateY(${this.movementY}px)`
            }
          }
          
          if (this.parallaxType === 'rotation') {
            return {
                transform: `rotateX(${this.movementX}deg) rotateY(${this.movementY}deg)`
            }
          }
      }
  },
}
</script>

<style lang="scss" scoped>
    .parallax-element {
      transition: all 2s;
      transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
    }
</style>
