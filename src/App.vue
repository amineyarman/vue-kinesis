<template>
  <div ref="parallaxSection" id="app" >
    <h1>Vue.js Mouse Parallax</h1>
    <p>A simple to use Mouse Parallax Component - Made with Vue.js</p>
    <parallax-container class="horizontal-card">
      <template slot-scope="props">
        <parallax-element
        class="text-container"
        :isHover="props.isHover"
        :parallaxStrength="-10"
        :type="'translation'"
        >
          <h2>Translation</h2>
          <p></p>
        </parallax-element>

        <parallax-element
        class="background-image"
        :isHover="props.isHover"
        :parallaxStrength="-30"
        :type="'translation'"
        >
        </parallax-element>
      </template>
    </parallax-container>
    <parallax-container class="horizontal-card centered-card">
      <template slot-scope="props">
        <parallax-element
        class="text-container"
        :isHover="props.isHover"
        :parallaxStrength="20"
        :type="'rotation'"
        >
          <h2>Rotation</h2>
        </parallax-element>

        <parallax-element
        class="background-image"
        :isHover="props.isHover"
        :parallaxStrength="10"
        :type="'rotation'"
        >
        </parallax-element>
      </template>
    </parallax-container>
    <parallax-container class="horizontal-card centered-card">
      <template slot-scope="props">
        <parallax-element
        class="text-container"
        :isHover="props.isHover"
        :parallaxStrength="10"
        :type="'depth'"
        >
          <h2>+Depth</h2>
        </parallax-element>

        <parallax-element
        class="background-image"
        :isHover="props.isHover"
        :parallaxStrength="-10"
        :type="'depth'"
        >
        </parallax-element>
      </template>
    </parallax-container>
  </div>
</template>

<script>
import parallaxContainer from "./components/parallax-container.vue";
import parallaxElement from "./components/parallax-element.vue";
export default {
  components: {
    parallaxContainer,
    parallaxElement
  }
};
</script>

<style lang="scss">
body {
  background-color: #0b1f2b;
  color: white;
  font-family: "Montserrat", sans-serif;

  h1 {
    font-size: 4rem;
    text-align: center;
    margin-bottom: 10px;
  }

  p {
    text-align: center;
  }
}
#app {
  .horizontal-card {
    display: flex;
    width: 70vw;
    max-width: 992px;
    height: 70vh;
    margin: auto;
    margin-top: 50px;

    h2 {
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
      background-image: url(https://orig00.deviantart.net/6fde/f/2014/270/4/d/____by_aminerman-d80qw6m.jpg);
      background-position: center;
      background-size: cover;
      width: 100%;
      height: 100%;
    }
  }

  .centered-card {
    display: block;
    width: 50vw;
    height: auto;

    div {
      width: 100%;
    }

    h2 {
      font-size: 5rem;
      text-align: center;
    }

    .text-container {
      position: absolute;
      top: 0;
      bottom: 0;
    }

    .background-image {
      width: 100%;
      height: 50vh;
    }
  }
}
</style>