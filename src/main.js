import Vue from 'vue'
import VueHighlightJS from 'vue-highlightjs'
import App from './App'

import './assets/css/highlighter.css'

Vue.use(VueHighlightJS)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})