<template>
  <div>
      <div class="horizontal-card" @mousemove="getMousePosition">
        <parallaxElement class="text-container" :parallaxStrength="-10">
          <h1>MouseParallax</h1>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius, omnis atque. Dolore rerum, doloremque nulla animi neque repellat ad voluptatem cumque cum laudantium aut illo illum placeat nihil inventore ipsa.</p>
        </parallaxElement>
        <parallaxElement class="background-image" :parallaxStrength="-30">
         
        </parallaxElement>
    </div>
  </div>
</template>

<script>
import parallaxElement from "./parallax-element.vue"
import throttle from "../js/throttle"
export default {
    methods: {
        getMousePosition: throttle(function(e) {
            this.$root.$data.mouseX = e.pageX
            this.$root.$data.mouseY = e.pageY
        }, 100)
  },
    components: {
        parallaxElement
    }
}
</script>

<style lang="scss" scoped>

</style>
