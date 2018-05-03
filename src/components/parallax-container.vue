<template>
 <div class="parallax-container" @mousemove="getMousePosition" @mouseout="parallaxStop" @mouseover="parallaxStart">
     <slot></slot>
    </div>
</template>

<script>
import parallaxElement from "./parallax-element.vue";
import { eventBus } from "../main.js";
import throttle from "../js/throttle";

export default {
  data() {
    return {
      mouseX: 0,
      mouseY: 0,
      hovering: false
    };
  },

  methods: {
    getMousePosition: throttle(function(e) {
    
      this.mouseX = e.pageX;
      this.mouseY = e.pageY;
      if (this.hovering === false) {
        return;
      } else {
        eventBus.$emit("mousePositionChanged", {
          mouseXB: this.mouseX,
          mouseYB: this.mouseY,
          hoveringB: this.hovering
        });
      }
    }, 100),

    parallaxStart() {
      this.hovering = true;
    },

    parallaxStop() {
      this.hovering = false;
    }
  },
    mounted(){
         if(this.$children[0].$options.propsData.parallaxStrength != 0) {
             this.hovering = true
         }
    },

  components: {
    parallaxElement
  }
};
</script>

<style lang="scss" scoped>
.parallax-container {
  perspective: 1000px;
}
</style>