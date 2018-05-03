# vuejs-mouse-parallax
An easy to use Mouse Parallax Component - Made with Vue.js

## Demo

[vuejs mouse parallax](https://aminerman.com/playground/vuejs-mouse-parallax/)

## Usage
In order for the effect to work, the <parallax-element /> should be contained within <parallax-container />

Options can then be passed to <parallax-element /> like so :

```html
// App.vue

<parallax-container>

    <parallax-element :parallaxStrength="-5" :type="'translation'">
        <h2>Put your content here</h2>
     </parallax-element>

</parallax-container>
```

## Props

| Prop   |      Type      |  Default Value | Description
|----------|:-------------:|------|------|
| parallaxStrength |  Number | 10 | Strength of the Parallax Effect |
| type |  String   | 'translation' | 'translation' - 'rotation' - 'depth' |

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
