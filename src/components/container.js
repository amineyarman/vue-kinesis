import KinesisContainer from './kinesis-container.vue';

const Plugin = {
  install(Vue) {
    Vue.component(KinesisContainer.name, KinesisContainer);
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
  KinesisContainer,
};
