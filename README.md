# vuejs-mouse-parallax
A Mouse Parallax Effect in Vue.js

## Demo

[vuejs mouse parallax](https://aminerman.com/playground/vuejs-mouse-parallax/)

## Usage
*vuejs-mouse-parallax* uses slots. You can add html inside a parallax-element component.

```html
// App.vue

<parallaxElement class="text-container" :parallaxStrength="-10" :mousePX='setMouseX' :mousePY='setMouseY'>
    <h1>MouseParallax</h1>
    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius, omnis atque. Dolore rerum, doloremque nulla animi neque repellat ad voluptatem cumque cum laudantium aut illo illum placeat nihil inventore ipsa.</p>
</parallaxElement>
```

## Props

| Prop   |      Type      |  Default Value | Description
|----------|:-------------:|------|------|
| isHover |  Boolean | true | Activates parallax effect |
| parallaxStrength |  Number | 10 | Parallax |
| speedFactor |  Number   | 0.15 | factor on how strong the effect is|
| direction |  String   | 'up' | Either 'up' or 'down', determines scroll direction of image |
| fixed | Boolean | false | Other parallax effect. Image is fixed in position |
| sectionHeight | Number | 70 | section height for mobile |
| breakpoint | String | '(min-width: 968px)' | Media query for mobile deactivation |
| sectionClass | String | 'Masthead' | CSS class of the outer section tag |
| containerClass | String | 'Masthead__image' | CSS class of the container holding the  image |
| parallaxClass | String | 'is-parallax' | Modifier class for the parallax effect |
| fixedClass | String | 'is-fixed' | Modifier class for the fixed parallax effect |

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## License

This software is distributed under [MIT license](LICENSE.txt).
