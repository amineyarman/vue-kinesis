<template>
	<div ref="parallaxSection" id="app" >
		<div id="infos">
			<a class="logo-link" href="https://aminerman.com" target="_blank"><img src="./assets/img/aminerman-logo.png" alt=""></a>
			<h1>Vue.js Mouse Parallax</h1>
      <img class="vmp-logo" src="./assets/img/vue-mouse-parallax.png" alt="">
			<p>A simple to use Mouse Parallax Component - Made with Vue.js</p>
			<a href="https://github.com/Aminerman/vuejs-mouse-parallax" target="_blank">
			<img src="./assets/img/github-logo.svg" alt=""> Download
			</a>
			<h2>How to use</h2>
			<p>In order for the effect to work, the <span class="html-tag">&lt;parallax-element /&gt;</span>  should be contained within  <span class="html-tag">&lt;parallax-container /&gt;</span> </p>
			<p>Options can then be passed to <span class="html-tag">&lt;parallax-element /&gt;</span> like so :</p>
			<pre v-highlightjs><code class="html">
        &lt;parallax-container>

            &lt;parallax-element :parallaxStrength="-5" :type="'translation'">
              &lt;h2>Put your content here&lt;/h2>
            &lt;/parallax-element>

        &lt;/parallax-container>
      </code></pre>
			<p>You can set the <span class="html-tag">:parallaxStrength</span> to any number and the the <span class="html-tag">:type</span> to the following : </p>
		</div>
		<parallax-container class="horizontal-card">
				<parallax-element
					class="text-container"
					:parallaxStrength="-5"
					:type="'translation'"
					>
					<h2>'translation'</h2>
				</parallax-element>
				<parallax-element
					class="background-image"
					:parallaxStrength="-10"
					:type="'translation'"
					>
				</parallax-element>
		</parallax-container>
		<pre v-highlightjs><code class="html">
      &lt;parallax-container class="horizontal-card">

          &lt;parallax-element class="text-container" :parallaxStrength="-5" :type="'translation'">
            &lt;h2>'translation'&lt;/h2>
          &lt;/parallax-element>

          &lt;parallax-element class="background-image" :parallaxStrength="-10" :type="'translation'">
          &lt;/parallax-element>

      &lt;/parallax-container>
      </code></pre>
		<parallax-container class="horizontal-card centered-card">
				<parallax-element
					class="text-container"
					:parallaxStrength="15"
					:type="'rotation'"
					>
					<h2>'rotation'</h2>
				</parallax-element>
				<parallax-element
					class="background-image"
					:parallaxStrength="10"
					:type="'rotation'"
					>
				</parallax-element>
		</parallax-container>
		<pre v-highlightjs><code class="html">
      &lt;parallax-container class="horizontal-card centered-card">

          &lt;parallax-element class="text-container" :parallaxStrength="15" :type="'rotation'">
            &lt;h2>'rotation'&lt;/h2>
          &lt;/parallax-element>

          &lt;parallax-element class="background-image" :parallaxStrength="10" :type="'rotation'">
          &lt;/parallax-element>
          
      &lt;/parallax-container>
      </code></pre>
		<parallax-container class="horizontal-card centered-card">
				<parallax-element
					class="text-container"
					:parallaxStrength="10"
					:type="'depth'"
					>
					<h2>'depth'</h2>
				</parallax-element>
				<parallax-element
					class="background-image"
					:parallaxStrength="-10"
					:type="'depth'"
					>
				</parallax-element>
		</parallax-container>
		<pre v-highlightjs><code class="html">
      &lt;parallax-container class="horizontal-card centered-card">

          &lt;parallax-element class="text-container" :parallaxStrength="10" :type="'depth'">
            &lt;h2>'rotation'&lt;/h2>
          &lt;/parallax-element>

          &lt;parallax-element class="background-image" :parallaxStrength="-10" :type="'depth'">
          &lt;/parallax-element>
          
      &lt;/parallax-container>
      </code></pre>
		<div id="footer">
			<a href="https://aminerman.com">aminerman.com</a>
		</div>
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

  pre {
    text-align: left;
    max-width: 980px;
    margin: 30px auto;
  }

  .html-tag {
    color: #8cebfa;
  }

  #infos {
    margin: auto;
    margin-top: 20px;
    text-align: center;
    padding-bottom: 30px;
    max-width: 980px;

    h1 {
      font-size: 4rem;
      margin-bottom: 10px;
    }

    h2 {
      font-size: 3rem;
      margin-top: 50px;
    }

    p {
      margin: 30px 0px;
    }

    a {
      color: white;
      text-decoration: none;
      display: inline-block;
      padding: 7px;
      line-height: 30px;
      border: 1px solid white;
      img {
        height: 30px;
        margin-right: 10px;
        float: left;
      }
      &.logo-link {
        border: none;
        img {
          height: 100px;
        }
      }
    }

    .vmp-logo {
      max-width: 350px;
      width: 90%;
      margin-top: 30px;
    }
  }

  #footer {
    text-align: center;
    padding: 20px 0px;
    a {
      color: white;
      text-decoration: none;
    }
  }
}

#app {
  h2 {
    margin: 0;
    font-size: 5rem;
    z-index: 5;
    text-shadow: 0 4px 20px rgba(2, 11, 22, 0.5);
  }

  .horizontal-card {
    display: flex;
    width: 50vw;
    max-width: 992px;
    height: auto;
    margin: auto;
    margin-top: 50px;

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
      background-position: center bottom;
      background-size: cover;
      width: 100%;
      height: 300px;
    }
  }

  .centered-card {
    display: block;
    width: 50vw;
    max-width: 992px;
    height: auto;

    div {
      width: 100%;
    }

    h2 {
      text-align: center;
    }

    .text-container {
      position: absolute;
      top: 0;
      bottom: 0;
    }

    .background-image {
      width: 100%;
      height: 300px;
    }
  }
}

@media (max-width: 992px) {
  #app {
    .centered-card,
    .horizontal-card {
      width: 95vw;
    }
  }
}

@media (max-width: 768px) {
  body {
    h1 {
      font-size: 2rem;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      text-align: justify;
    }
  }
  #app {
    h2 {
      font-size: 4rem;
    }
  }
}
</style>