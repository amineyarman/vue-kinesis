import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

export const eventBus = new Vue();

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})