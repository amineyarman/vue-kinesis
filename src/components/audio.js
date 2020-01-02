import KinesisAudio from './kinesis-audio.vue';

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
};
