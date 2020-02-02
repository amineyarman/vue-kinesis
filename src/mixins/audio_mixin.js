export default {
  props: {
    audio: {
      type: String,
      required: false,
    },
    playAudio: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      analyser: null,
      audioArray: null,
      audioData: null,
      audioRef: null,
      wasPlayed: false,
      isPlaying: false,
    };
  },
  watch: {
    audio() {
      this.wasPlayed = false;
      this.isPlaying = false;
    },
    playAudio(play) {
      if (play) {
        this.play();
      } else {
        this.stop();
      }
    },
  },
  methods: {
    play() {
      if (!this.active) return;
      if (!this.wasPlayed) {
        this.handleAudio();
        this.wasPlayed = true;
      }
      this.isPlaying = true;
      this.audioRef.play();
      this.getSongData();
    },
    stop() {
      this.isPlaying = false;
      this.audioRef.pause();
    },
    handleAudio() {
      const { audio } = this.$refs;
      this.audioRef = audio;
      const context = new AudioContext();
      const src = context.createMediaElementSource(audio);
      const analyser = context.createAnalyser();
      src.connect(analyser);
      analyser.connect(context.destination);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const audioArray = new Uint8Array(bufferLength);
      this.audioArray = audioArray;
      this.analyser = analyser;
    },
    getSongData() {
      if (this.isPlaying) {
        this.analyser.getByteFrequencyData(this.audioArray);

        this.audioData = new Array(this.audioArray); // @Todo reactivity issue

        requestAnimationFrame(this.getSongData);
      }
    },
  },
};
