/* eslint-disable */
import KinesisContainer from './components/kinesis-container.vue';
import KinesisElement from './components/kinesis-element.vue';
import KinesisAudio from './components/kinesis-audio.vue';
import KinesisScroll from './components/kinesis-scroll.vue';
import KinesisDistance from './components/kinesis-distance.vue';

import * as components from './components/index';

const install = function (Vue) {
  if (install.installed) {
    return;
  }
  install.installed = true;

  for (const name in components) {
    Vue.use(components[name]);
  }

  Vue.component('kinesis-container', KinesisContainer);
  Vue.component('kinesis-element', KinesisElement);
  Vue.component('kinesis-audio', KinesisAudio);
  Vue.component('kinesis-scroll', KinesisScroll);
  Vue.component('kinesis-distance', KinesisDistance);
};

const Plugin = { install };

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
  KinesisContainer, KinesisElement, KinesisScroll, KinesisAudio, KinesisDistance,
};
