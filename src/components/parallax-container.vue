<template>
    <div class="horizontal-card" @mousemove="getMousePosition">
        <parallaxElement class="text-container" :parallaxStrength="-10" :parallaxType="'translation'" :mousePX='setMouseX' :mousePY='setMouseY'>
          <h1>MouseParallax</h1>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius, omnis atque. Dolore rerum, doloremque nulla animi neque repellat ad voluptatem cumque cum laudantium aut illo illum placeat nihil inventore ipsa.</p>
        </parallaxElement>
        <parallaxElement class="background-image" :parallaxStrength="-30" :parallaxType="'rotation'" :mousePX='setMouseX' :mousePY='setMouseY'>
        </parallaxElement>
    </div>
</template>

<script>
import parallaxElement from "./parallax-element.vue"
import _ from 'lodash'

export default {
  data() {
    return {
      mouseX: 0,
      mouseY: 0
    }
  },
  computed: {
    setMouseX() {
      return this.mouseX
    },
    setMouseY() {
      return this.mouseY
    }
  },
  methods: {
     getMousePosition: _.throttle(function(e) {
      this.mouseX = e.pageX
      this.mouseY = e.pageY
    }, 100)
  },
  components: {
    parallaxElement
  }
}
</script>

<style lang="scss" scoped>

</style>
