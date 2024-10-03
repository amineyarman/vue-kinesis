# October 2024: A full TS version is now available [KinesisJS](https://kinesisjs.com). You can use it in your vue projects if you need any of the new features. It works with Vue but a dedicated Vue version is in the works.
# March 2024: The project has been on standby for a while now. But good news! I'm working on a brand new version, more robust, with better documentation and more features!
What's in preparation:
- Rewriting everything in TS
- New interactions
- A detailed documentation
- A vanilla TS version

# vue-kinesis

[![npm](https://img.shields.io/npm/v/vue-kinesis.svg)](https://img.shields.io/npm/v/vue-kinesis.svg) 
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)
[![vue2](https://img.shields.io/badge/vue-3.x-brightgreen.svg)](https://vuejs.org/)

Easy to use Vue.js components for creating interactive animations

## Demo

[Kinesis Demo](https://aminerman.com/kinesis/)

## Tutorials 

- [LogRocket - Top 5 Vue Animation Libraries](https://blog.logrocket.com/top-5-vue-animation-libraries-compared/)
- [LogRocket - Interactive Vue Animations with Kinesis](https://blog.logrocket.com/interactive-vue-animations-with-kinesis/)
- [Leonardo Gruppelli - Kinesis Animation for Nuxt](https://medium.com/@leonardo.gruppelli/kinesis-awesome-animations-for-your-vue-nuxt-applications-8c16ae701e92)
- [Coliss - 便利なのが登場！Vue.jsでインタラクティブなアニメーションを簡単に実装できる軽量コンポーネント -Kinesis](https://coliss.com/articles/build-websites/operation/javascript/interactive-animations-with-vue-js-kinesis.html)
- [Kabanoki - コイツ動くぞ？！的なアニメーションが付けられる「vue-kinesis」](https://www.kabanoki.net/5792/)
- [Mebee - Nuxt.js vue-kinesisを使用してアニメーションをかける](https://mebee.info/2020/05/18/post-6592/)
- ... Feel free to open a PR if you want to suggest a tutorial link 🙏


# Vue3 - Installation 

```
npm install --save vue-kinesis@next
```

## Vue3 - Default import 

Install all the components:

```javascript
import { createApp } from "vue";
import App from "./App.vue";
import VueKinesis from "vue-kinesis";

const app = createApp(App);
app.use(VueKinesis);

app.mount("#app");
```

# Vue2 - Installation

```
npm install --save vue-kinesis
```

## Vue2 - Default import

Install all the components:

```javascript
import Vue from 'vue'
import VueKinesis from 'vue-kinesis'

Vue.use(VueKinesis)
```

Use specific components:

```javascript
import Vue from 'vue'
import { KinesisContainer, KinesisElement } from 'vue-kinesis'

Vue.component('kinesis-container', KinesisContainer)
Vue.component('kinesis-element', KinesisElement)
```

## Browser

```html
<script src="vue.js"></script>
<script src="vue-kinesis.min.js"></script>
```


# Usage

[How to use](https://aminerman.com/kinesis/)


## Props

### kinesis-container

| Prop   |      Type      |  Default Value | Description
|----------|:-------------:|------|------|
| active |  Boolean | true | To enable or disable the interactions |
| duration |  Number | 1000 | Speed of the parallax animation in ms |
| easing |  String   | "cubic-bezier(0.23, 1, 0.32, 1)" | Easing of the parallax animation |
| tag |  String   | div | Takes any valid html tag |
| event |  String   | "move" | Event to which the container will react. Possible values are "move" and "scroll" |
| perspective |  Number   | 1000 | Effective for the 'depth' parallax type |
| audio |  String   |  | Path towards an audio file |
| playAudio |  Boolean   |  | Start/Stop the attached audio file |

### kinesis-element
| Prop   |      Type      |  Default Value | Description
|----------|:-------------:|------|------|
| strength |  Number | 10 | Strength of the motion effect |
| type |  String   | "translate" | translate - rotate - scale - scaleX - scaleY - depth - depth_inv |
| tag |  String   | "div" | Takes any valid html tag |
| transformOrigin |  String   | "center" | Similar to the CSS transform-origin property |
| originX |  Number   | 50 | The motion's origin relative to the container, on the X axis. 50 being the center of the container, 0 the left side, 100 the right side. |
| originY |  Number   | 50 | The motion's origin relative to the container, on the Y axis. 50 being the center of the container, 0 the top side, 100 the bottom side. |
| axis |  String   | null | Constrain the movement to one axis. Possible values: "x" - "y" |
| maxX |  Number   | null | Limit the maximum range of the movement on the X axis |
| maxY |  Number   | null | Limit the maximum range of the movement on the Y axis |
| minX |  Number   | null | Limit the minimum range of the movement on the X axis |
| minY |  Number   | null | Limit the minimum range of the movement on the Y axis |
| cycle |  Number   | 0 | How many times the movement will repeat |

### kinesis-audio
| Prop   |      Type      |  Default Value | Description
|----------|:-------------:|------|------|
| audioIndex |  Number | 50 | To which frequency to react, on a range of integer values that goes from 0 to 127. |
| strength |  Number | 10 | Strength of the motion effect |
| type |  String   | "translate" | translate - rotate - scale - scaleX - scaleY - depth - depth_inv |
| tag |  String   | "div" | Takes any valid html tag |
| transformOrigin |  String   | "center" | Similar to the CSS transform-origin property |
| originX |  Number   | 50 | The motion's origin relative to the container, on the X axis. 50 being the center of the container, 0 the left side, 100 the right side. |
| originY |  Number   | 50 | The motion's origin relative to the container, on the Y axis. 50 being the center of the container, 0 the top side, 100 the bottom side. |
| axis |  String   | null | Constrain the movement to one axis. Possible values: "x" - "y" |
| maxX |  Number   | null | Limit the maximum range of the movement on the X axis |
| maxY |  Number   | null | Limit the maximum range of the movement on the Y axis |
| minX |  Number   | null | Limit the minimum range of the movement on the X axis |
| minY |  Number   | null | Limit the minimum range of the movement on the Y axis |
| cycle |  Number   | 0 | How many times the movement will repeat |

## Migrating from vue-mouse-parallax
Migration from vue-mouse-parallax is quite easy:

### Components
- parallax-container -> kinesis-container
- parallax-element -> kinesis-element

### Props 
- parallaxStrength -> strength
- animationDuration -> duration

### Prop values
- translation -> translate
- rotation -> rotate

## License

[MIT](http://opensource.org/licenses/MIT)
