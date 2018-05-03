import Vue from 'vue'
import VueHighlightJS from 'vue-highlightjs'
import App from './App'

import './assets/css/highlighter.css'

Vue.use(VueHighlightJS)

Vue.config.productionTip = false

export const eventBus = new Vue();

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})