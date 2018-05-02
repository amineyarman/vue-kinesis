<template>
 <div class="parallax-container" @mousemove="getMousePosition" @mouseout="parallaxStop" @mouseover="parallaxStart">
     <slot :isHover="hovering"></slot>
    </div>
</template>

<script>
import parallaxElement from "./parallax-element.vue"
import { eventBus } from '../main.js'
import _ from 'lodash'
export default {
  data() {
    return {
      mouseX: 0,
      mouseY: 0,
      hovering: false
    }
  },
  methods: {
     getMousePosition: _.throttle(function(e) {
      this.mouseX = e.pageX
      this.mouseY = e.pageY
      if(this.hovering === false) {
          return
      }
      else {
        eventBus.$emit('mousePositionChanged',
        {
            mouseXB: this.mouseX,
            mouseYB: this.mouseY,
            hoveringB: this.hovering
        })
      }
    }, 100),
    parallaxStart: function() {
        this.hovering = true
    },
    parallaxStop: function() {
        this.hovering = false
    }
  },
  components: {
    parallaxElement
  }
}
</script>

<style lang="scss" scoped>
    .parallax-container {
        perspective: 5000px;
    }
</style>