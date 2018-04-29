<template>
  <div ref="parallaxSection" id="app" @mousemove="getMousePosition">
    <h1 data-hp="10">Hello</h1>
    <h1>Bonjour</h1>
    <parallaxElement :parallaxStrength="40" :mousePX='mouseXC'>
      YAY
    </parallaxElement>
    <parallaxElement :parallaxStrength="-40" :mousePX='mouseXC'>
      hello
    </parallaxElement>
  </div>
</template>

<script>
import parallaxElement from "./components/parallax-element.vue";

export default {
  data() {
    return {
      mouseX: 0
    }
  },
  computed: {
    mouseXC() {
      return this.mouseX
    }
  },
  methods: {
    getMousePosition(e) {
      this.mouseX = e.pageX
    }
  },
  components: {
    parallaxElement
  }
}
</script>

<style lang="scss" scoped>
</style>

