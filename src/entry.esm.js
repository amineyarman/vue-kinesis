import KinesisAudio from './components/kinesis-audio.vue';
import KinesisContainer from './components/kinesis-container.vue';
import KinesisDistance from './components/kinesis-distance.vue';
import KinesisElement from './components/kinesis-element.vue';
import KinesisScroll from './components/kinesis-scroll.vue';

const install = function installVueKinesis(app) {
    app.component(KinesisAudio.name, KinesisAudio);
    app.component(KinesisContainer.name, KinesisContainer);
    app.component(KinesisDistance.name, KinesisDistance);
    app.component(KinesisElement.name, KinesisElement);
    app.component(KinesisScroll.name, KinesisScroll);
};

export default install;

export {
  KinesisAudio,
  KinesisContainer,
  KinesisDistance,
  KinesisElement,
  KinesisScroll,
};
