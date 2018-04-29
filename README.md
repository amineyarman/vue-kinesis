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
