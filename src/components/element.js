import KinesisElement from './kinesis-element.vue';

const Plugin = {
  install(Vue) {
    Vue.component(KinesisElement.name, KinesisElement);
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
  KinesisElement,
};
