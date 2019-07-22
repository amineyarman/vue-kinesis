<template>
 <component :is="tag" class="parallax-container" @mousemove="getMousePosition"
      @mouseout="parallaxStop" @mouseover="parallaxStart"
      :style="{
        perspective: perspective,
      }"
 >
   <slot></slot>
 </component>
</template>

<script>
import throttle from "../js/throttle";

export default {
  props: {
    perspective: {
      type: String,
      default: '1000px'
    },
    tag: {
      type: String,
      default: 'div'
    },
  },
  
  data() {
    return {
      mouseX: 0,
      mouseY: 0,
      hovering: false
    };
  },

  methods: {
    getMousePosition: throttle(function(e) {
      const children = this.$children.map(child => {
        if (child.$options.propsData.parallaxStrength != 0) {
          this.hovering = true;
        }
      });
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      if (this.hovering === false) {
        return;
      }
    }, 100),

    parallaxStart() {
      this.hovering = true;
      const children = this.$children.map(child => {
        child.isHovering = true;
      });
    },

    parallaxStop() {
      this.hovering = false;
      const children = this.$children.map(child => {
        child.isHovering = false;
      });
    }
  },
};
</script>
