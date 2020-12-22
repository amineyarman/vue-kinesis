/* eslint-disable */
import KinesisContainer from './components/kinesis-container.vue';
import KinesisElement from './components/kinesis-element.vue';
import KinesisAudio from './components/kinesis-audio.vue';
import KinesisScroll from './components/kinesis-scroll.vue';
import KinesisDistance from './components/kinesis-distance.vue';

import * as components from './components/index';

const install = function (vue) {
  if (install.installed) {
    return;
  }
  install.installed = true;

  for (const name in components) {
    vue.use(components[name]);
  }

  vue.component('kinesis-container', KinesisContainer);
  vue.component('kinesis-element', KinesisElement);
  vue.component('kinesis-audio', KinesisAudio);
  vue.component('kinesis-scroll', KinesisScroll);
  vue.component('kinesis-distance', KinesisDistance);
};

const Plugin = { install };

let GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.vue;
}

if (GlobalVue) {
  GlobalVue.use(Plugin);
}

export default Plugin;

export {
  KinesisContainer, KinesisElement, KinesisScroll, KinesisAudio, KinesisDistance,
};
