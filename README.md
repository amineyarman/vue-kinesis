# vue-mouse-parallax

[![npm](https://img.shields.io/npm/v/vue-mouse-parallax.svg) ![npm](https://img.shields.io/npm/dm/vue-mouse-parallax.svg)](https://www.npmjs.com/package/vue-mouse-parallax)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

An easy to use Mouse Parallax Component - Made with Vue.js

## Demo

[vuejs mouse parallax](https://aminerman.com/playground/vuejs-mouse-parallax/)


# Installation

```
npm install --save vue-mouse-parallax
```

## Default import

Install all the components:

```javascript
import Vue from 'vue'
import VueMouseParallax from 'vue-mouse-parallax'

Vue.use(VueMouseParallax)
```

Use specific components:

```javascript
import Vue from 'vue'
import { ParallaxContainer, ParallaxElement } from 'vue-mouse-parallax'

Vue.component('parallax-container', ParallaxContainer)
Vue.component('parallax-element', ParallaxElement)
```

## Browser

```html
<script src="vue.js"></script>
<script src="vue-mouse-parallax/dist/vue-mouse-parallax.common.js"></script>
```


# Usage

In order for the effect to work, the `<parallax-element />` should be contained within `<parallax-container />`

Options can then be passed to `<parallax-element />` like so :

```html
<parallax-container>
    <parallax-element :parallaxStrength="10" type="translation" tag="div">
        <h2>Put your content here</h2>
     </parallax-element>
</parallax-container>
```

## Props

### parallax-container

| Prop   |      Type      |  Default Value | Description
|----------|:-------------:|------|------|
| animationDuration |  Number | 1000 | Speed of the parallax animation in ms |
| easing |  String   | cubic-bezier(0.23, 1, 0.32, 1) | Easing of the parallax animation |
| tag |  String   | div | Takes any valid html tag |
| perspective |  Number   | 1000 | Effective for the 'depth' parallax type |

### parallax-element
| Prop   |      Type      |  Default Value | Description
|----------|:-------------:|------|------|
| parallaxStrength |  Number | 10 | Strength of the Parallax Effect |
| type |  String   | 'translation' | 'translation' - 'rotation' - 'depth' |
| tag |  String   | div | Takes any valid html tag |

# Todo
- Combine multiple transform types on one element
- filter: drop-shadow() prop on parallax-element
- Translate on one direction
- Touch events
- Gyroscope
- Events
- Active prop

## License

[MIT](http://opensource.org/licenses/MIT)
