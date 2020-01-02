import KinesisScroll from './kinesis-scroll.vue';

const Plugin = {
  install(Vue) {
    Vue.component(KinesisScroll.name, KinesisScroll);
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
  KinesisScroll,
};
