<template>
  <div ref="parallaxSection" id="app" >
    <div class="horizontal-card" @mousemove="getMousePosition">
        <parallaxElement class="text-container" :parallaxStrength="-10" :mousePX='setMouseX' :mousePY='setMouseY'>
          <h1>MouseParallax</h1>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius, omnis atque. Dolore rerum, doloremque nulla animi neque repellat ad voluptatem cumque cum laudantium aut illo illum placeat nihil inventore ipsa.</p>
        </parallaxElement>
        <parallaxElement class="background-image" :parallaxStrength="-30" :mousePX='setMouseX' :mousePY='setMouseY'>
         
        </parallaxElement>
    </div>
  </div>
</template>

<script>
import parallaxElement from "./components/parallax-element.vue";

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
    getMousePosition(e) {
      this.mouseX = e.pageX
      this.mouseY = e.pageY
    }
  },
  components: {
    parallaxElement
  }
}
</script>

<style lang="scss">
  body {
    background-color: #0b1f2b;
    color: white;
    font-family: 'Montserrat', sans-serif;
  }

  #app {
    .horizontal-card {
      display: flex;
      width: 70vw;
      height: 70vh;
      margin: auto;

      h1 {
        margin: 0;
        font-size: 6rem;
        z-index: 5;
        text-shadow: 0 4px 20px rgba(2, 11, 22, 0.5);
      }

      p {
        line-height: 25px;
      }

      div {
        width: 50%;
      }

      .text-container {
        position: relative;
        z-index: 5;
      }

      .background-image {
        background-image: url(https://images.unsplash.com/photo-1504870712357-65ea720d6078?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d91ffea4f802668c524df165caf52704&auto=format&fit=crop&w=2500&q=80);
        background-position: center;
        background-size: cover;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>

