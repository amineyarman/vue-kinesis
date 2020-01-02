import KinesisDistance from './kinesis-distance.vue';

const Plugin = {
  install(Vue) {
    Vue.component(KinesisDistance.name, KinesisDistance);
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
  KinesisDistance,
};
