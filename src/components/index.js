import KinesisAudio from './kinesis-audio.vue';
import KinesisContainer from './kinesis-container.vue';
import KinesisDistance from './kinesis-distance.vue';
import KinesisElement from './kinesis-element.vue';
import KinesisScroll from './kinesis-scroll.vue';

const Plugin = {
  install(Vue) {
    Vue.component(KinesisAudio.name, KinesisAudio);
  },
};

let GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(Plugin);
}

export default Plugin;

export {
  KinesisAudio,
  KinesisContainer,
  KinesisDistance,
  KinesisElement,
  KinesisScroll,
};
