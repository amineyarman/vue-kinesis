import KinesisContainer from './kinesis-container.vue';
import KinesisElement from './kinesis-element.vue';
import KinesisAudio from './kinesis-audio.vue';
import KinesisScroll from './kinesis-scroll.vue';
import KinesisDistance from './kinesis-distance.vue';

export function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('kinesis-container', KinesisContainer);
  Vue.component('kinesis-element', KinesisElement);
  Vue.component('kinesis-audio', KinesisAudio);
  Vue.component('kinesis-scroll', KinesisScroll);
  Vue.component('kinesis-distance', KinesisDistance);
}

const plugin = {
  install,
};

let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

export {
  KinesisContainer, KinesisElement, KinesisScroll, KinesisAudio, KinesisDistance,
};
