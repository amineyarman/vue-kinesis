import KinesisAudio from './kinesis-audio.vue'
import KinesisContainer from './kinesis-container.vue'
import KinesisDistance from './kinesis-distance.vue'
import KinesisElement from './kinesis-element.vue'
import KinesisScroll from './kinesis-scroll.vue'

const Plugin = {
  install(vue) {
    vue.component(KinesisAudio.name, KinesisAudio)
    vue.component(KinesisContainer.name, KinesisContainer)
    vue.component(KinesisDistance.name, KinesisDistance)
    vue.component(KinesisElement.name, KinesisElement)
    vue.component(KinesisScroll.name, KinesisScroll)
  },
}

let GlobalVue = null

if (typeof window !== 'undefined') {
  GlobalVue = window.vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.vue
}

if (GlobalVue) {
  GlobalVue.use(Plugin)
}

export default Plugin

export {
  KinesisAudio,
  KinesisContainer,
  KinesisDistance,
  KinesisElement,
  KinesisScroll,
}
