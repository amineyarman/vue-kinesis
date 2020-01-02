(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.VueKinesis = {}));
}(this, (function (exports) { 'use strict';

  function inViewport(element) {
    var isInViewport = element.bottom >= 0
      && element.right >= 0
      && element.top
        <= (window.innerHeight || document.documentElement.clientHeight)
      && element.left <= (window.innerWidth || document.documentElement.clientWidth);

    return isInViewport;
  }

  function isTouch() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  /* eslint-disable no-console */
  function throttle(callback, delay, type) {
    var last;
    var timer;
    // eslint-disable-next-line func-names
    return function () {
      var context = this;
      var newDelay;
      if (type === 'scroll') {
        newDelay = delay;
      } else {
        newDelay = context.duration > 1000 ? delay : context.duration / 10;
      }

      var now = +new Date();
      // eslint-disable-next-line prefer-rest-params
      var args = arguments;
      if (last && now < last + newDelay) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          requestAnimationFrame(function () {
            last = now;
            callback.apply(context, args);
          });
        }, newDelay);
      } else {
        requestAnimationFrame(function () {
          last = now;
          callback.apply(context, args);
        });
      }
    };
  }

  var baseMixin = {
    props: {
      active: {
        type: Boolean,
        default: true,
      },
      duration: {
        type: Number,
        default: 1000,
      },
      easing: {
        type: String,
        default: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      tag: {
        type: String,
        default: 'div',
      },
    },
  };

  var perspectiveMixin = {
    props: {
      perspective: {
        type: Number,
        default: 1000,
      },
    },
    computed: {
      style: function style() {
        return { perspective: ((this.perspective) + "px") };
      },
    },
  };

  var audioMixin = {
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
    data: function data() {
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
      audio: function audio() {
        this.wasPlayed = false;
        this.isPlaying = false;
      },
      playAudio: function playAudio(play) {
        if (play) {
          this.play();
        } else {
          this.stop();
        }
      },
    },
    methods: {
      play: function play() {
        if (!this.active) { return; }
        if (!this.wasPlayed) {
          this.handleAudio();
          this.wasPlayed = true;
        }
        this.isPlaying = true;
        this.audioRef.play();
        this.getSongData();
      },
      stop: function stop() {
        this.isPlaying = false;
        this.audioRef.stop();
      },
      ended: function ended() {
        this.isPlaying = false;
      },
      handleAudio: function handleAudio() {
        var ref = this.$refs;
        var audio = ref.audio;
        this.audioRef = audio;
        var context = new AudioContext();
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();
        src.connect(analyser);
        analyser.connect(context.destination);
        analyser.fftSize = 256;
        var bufferLength = analyser.frequencyBinCount;
        var audioArray = new Uint8Array(bufferLength);
        this.audioArray = audioArray;
        this.analyser = analyser;
      },
      getSongData: function getSongData() {
        if (this.isPlaying) {
          this.analyser.getByteFrequencyData(this.audioArray);

          this.audioData = new Array(this.audioArray); // @Todo reactivity issue

          requestAnimationFrame(this.getSongData);
        }
      },
    },
  };

  //

  var script = {
    name: 'KinesisContainer',
    mixins: [baseMixin, perspectiveMixin, audioMixin],
    provide: function provide() {
      var this$1 = this;

      var context = {};

      Object.defineProperty(context, 'audioData', {
        enumerable: true,
        get: function () { return this$1.audioData; },
      });
      Object.defineProperty(context, 'cycleMovement', {
        enumerable: true,
        get: function () { return this$1.cycleMovement; },
      });

      Object.defineProperty(context, 'duration', {
        enumerable: true,
        get: function () { return this$1.duration; },
      });

      Object.defineProperty(context, 'easing', {
        enumerable: true,
        get: function () { return this$1.easing; },
      });

      Object.defineProperty(context, 'event', {
        enumerable: true,
        get: function () { return this$1.event; },
      });

      Object.defineProperty(context, 'isMoving', {
        enumerable: true,
        get: function () { return this$1.isMoving; },
      });

      Object.defineProperty(context, 'movement', {
        enumerable: true,
        get: function () { return this$1.movement; },
      });

      Object.defineProperty(context, 'orientation', {
        enumerable: true,
        get: function () { return this$1.orientation; },
      });

      Object.defineProperty(context, 'scrollPosition', {
        enumerable: true,
        get: function () { return this$1.scrollPosition; },
      });

      return { context: context };
    },
    props: {
      event: {
        type: String,
        default: 'move', // move, scroll
      },
    },
    data: function data() {
      return {
        pointer: {
          x: 0,
          y: 0,
        },
        clickPosition: {
          x: 0,
          y: 0,
        },
        movement: {
          x: 0,
          y: 0,
        },
        cycleMovement: {
          x: 0,
          y: 0,
        },
        scrollPosition: 0,
        orientation: {
          x: 0,
          y: 0,
          z: 0,
        },
        isMoving: false,
      };
    },
    mounted: function mounted() {
      if (this.event === 'scroll') {
        window.addEventListener('scroll', this.handleScroll);
      }
      if (this.event === 'move' && this.isTouch) {
        window.addEventListener(
          'deviceorientation',
          this.handleOrientation,
          true
        );
      }
    },
    beforeDestroy: function beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener(
        'deviceorientation',
        this.handleOrientation,
        true
      );
    },
    computed: {
      shape: function shape() {
        return this.$el.getBoundingClientRect();
      },
      center: function center() {
        return this.getCoordinates(this.shape.width / 2, this.shape.height / 2);
      },
      isTouch: function isTouch$1() {
        return isTouch();
      },
    },
    watch: {
      type: function type(newVal, oldVal) {
        if (newVal === 'scroll') {
          window.addEventListener('scroll', this.handleScroll);
        } else if (newVal === 'hover' && this.isTouch) {
          window.addEventListener(
            'deviceorientation',
            this.handleOrientation,
            true
          );
        }
        if (oldVal === 'scroll') {
          window.removeEventListener('scroll', this.isInViewport);
        } else if (newVal === 'hover' && this.isTouch) {
          window.removeEventListener(
            'deviceorientation',
            this.handleOrientation,
            true
          );
        }
      },
    },
    methods: {
      getCoordinates: function getCoordinates(x, y) {
        return { x: x, y: y };
      },
      handleMovement: throttle(function (event) {
        if (!this.active || this.event === 'scroll') { return; }
        var ref = this;
        var pointer = ref.pointer;
        pointer.x = event.clientX;
        pointer.y = event.clientY;

        this.movementBehavior();
      }, 100),
      handleMovementStart: function handleMovementStart() {
        this.isMoving = true;
      },
      handleMovementStop: function handleMovementStop() {
        this.isMoving = false;
      },
      handleClick: function handleClick(event) {
        if (!this.active) { return; }
        var ref = this;
        var clickPosition = ref.clickPosition;
        clickPosition.x = event.clientX;
        clickPosition.y = event.clientY;
      },
      movementBehavior: function movementBehavior() {
        var shape = this.$el.getBoundingClientRect();
        this.getCycleMovement(
          this.pointer.x,
          this.pointer.y,
          shape.width,
          shape.height,
          shape
        );
        this.movement = this.getMovement(shape);
      },
      getMovement: function getMovement(shape) {
        var relativeX = this.pointer.x - shape.left;
        var relativeY = this.pointer.y - shape.top;

        var movementX = relativeX / this.center.x;
        var movementY = relativeY / this.center.y;

        return { x: movementX, y: movementY };
      },
      getCycleMovement: function getCycleMovement(xPos, yPos, width, height, shape) {
        var x = ((xPos - shape.left) * (Math.PI * 2)) / width;
        var y = ((yPos - shape.top) * (Math.PI * 2)) / height;

        this.cycleMovement = {
          x: x, y: y, width: width, height: height,
        };
      },
      handleScroll: throttle(
        function () {
          if (!this.active || this.event === 'move') { return; }
          var shape = this.$el.getBoundingClientRect();
          var isInViewport = inViewport(shape);

          if (this.event === 'scroll' && isInViewport && !!shape.height) {
            this.getCycleMovement(
              0,
              0,
              window.innerWidth,
              window.innerHeight,
              shape
            );
            this.scrollPosition = (shape.top - window.innerHeight)
              / (shape.height + window.innerHeight);
          }
        },
        19,
        'scroll'
      ),
      handleOrientation: throttle(function (event) {
        if (!this.active) { return; }
        var shape = this.$el.getBoundingClientRect();
        var isInViewport = inViewport(shape);
        if (this.event === 'move' && isInViewport) {
          var x = event.gamma / 45;
          var y = event.beta / 90;
          this.orientation = { x: x, y: y };
        }
      }, 100),
    },
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      var options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      var hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      _vm.tag,
      {
        tag: "component",
        style: _vm.style,
        on: {
          mousemove: function($event) {
            $event.stopPropagation();
            return _vm.handleMovement($event)
          },
          mouseenter: _vm.handleMovementStart,
          mouseleave: _vm.handleMovementStop,
          click: _vm.handleClick
        }
      },
      [
        _vm._t("default"),
        _vm._v(" "),
        _vm.audio
          ? _c(
              "audio",
              {
                ref: "audio",
                attrs: { type: "audio/mpeg" },
                on: { ended: _vm.ended }
              },
              [_c("source", { attrs: { src: _vm.audio } })]
            )
          : _vm._e()
      ],
      2
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = undefined;
    /* scoped */
    var __vue_scope_id__ = undefined;
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__ = normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      undefined,
      undefined,
      undefined
    );

  var motionMixin = {
    props: {
      type: {
        type: String,
        default: 'translate', // translate, rotate, scale, scaleX, scaleY, depth, depth_inv, custom
      },
      transformOrigin: {
        type: String,
        default: 'center',
      },
      originX: {
        type: Number,
        default: 50,
      },
      originY: {
        type: Number,
        default: 50,
      },
      strength: {
        type: Number,
        default: 10,
      },
      audioIndex: {
        type: Number,
        default: 50,
      },
      axis: {
        type: String,
        default: null,
      },
      maxX: {
        type: Number,
        default: null,
      },
      maxY: {
        type: Number,
        default: null,
      },
      minX: {
        type: Number,
        default: null,
      },
      minY: {
        type: Number,
        default: null,
      },
      cycle: {
        type: Number,
        default: 0,
      },
    },
    methods: {
      strengthManager: function strengthManager() {
        return this.type === 'depth' || this.type === 'depth_inv'
          ? Math.abs(this.strength)
          : this.strength;
      },
    },
  };

  var transformMixin = {
    methods: {
      transformSwitch: function transformSwitch(type, x, y, s) {
        var transform;
        switch (type) {
          case 'translate':
            transform = this.translateMovement(x, y);
            break;
          case 'rotate':
            transform = this.rotateMovement(x, y);
            break;
          case 'depth':
            transform = this.depthMovement(x, y, s);
            break;
          case 'depth_inv':
            transform = this.depthMovement(-x, -y, s);
            break;
          case 'scale':
            transform = this.scaleMovement(x, y);
            break;
        }
        return transform;
      },
      translateMovement: function translateMovement(x, y) {
        return ("translate3d(" + (-x) + "px, " + (-y) + "px, 0)");
      },
      rotateMovement: function rotateMovement(x, y) {
        var movement;
        if (!this.axis) {
          movement = x + y;
        } else if (this.axis === 'x') {
          movement = 2 * x;
        } else if (this.axis === 'y') {
          movement = 2 * y;
        }
        return ("rotate3d(0,0,1," + movement + "deg)");
      },
      depthMovement: function depthMovement(x, y, s) {
        return ("rotateX(" + (-y) + "deg) rotateY(" + x + "deg) translate3d(0,0," + (s * 2) + "px)");
      },
      scaleMovement: function scaleMovement(x, y) {
        var ref = this;
        var type = ref.type;
        var movement = (Math.sign(this.strength) * (Math.abs(x) + Math.abs(y))) / 10 + 1;
        return ("scale3d(" + (type === 'scaleX' || type === 'scale' ? movement : 1) + ",\n            " + (type === 'scaleY' || type === 'scale' ? movement : 1) + ",\n            1)");
      },
    },
  };

  //

  var script$1 = {
    name: 'KinesisElement',
    mixins: [motionMixin, transformMixin],
    inject: ['context'],
    props: {
      tag: {
        type: String,
        default: 'div',
      },
    },
    computed: {
      transform: function transform() {
        return this.transformMovement();
      },
      transformParameters: function transformParameters() {
        return {
          transitionProperty: 'transform',
          transitionDuration: this.transitionDuration,
          transformOrigin: this.transformOrigin,
          transitionTimingFunction: this.transitionTimingFunction,
        };
      },
      transitionDuration: function transitionDuration() {
        var ref = this.context;
        var duration = ref.duration;
        return (duration + "ms");
      },
      transitionTimingFunction: function transitionTimingFunction() {
        return this.context.easing;
      },
      isTouch: function isTouch$1() {
        return isTouch();
      },
    },
    methods: {
      transformMovement: function transformMovement() {
        var ref = this;
        var context = ref.context;

        if (!context.isMoving && context.event === 'move') { return {}; }

        var transform; var movementX; var
          movementY;

        var eventTrigger = context.event;

        var strength = this.strengthManager();

        if (this.cycle <= 0) {
          var ref$1 = !this.isTouch ? context.movement : context.orientation;
          var x = ref$1.x;
          var y = ref$1.y;

          var isScroll = eventTrigger === 'scroll';

          if (!isScroll) {
            var originX = this.isTouch ? 0 : this.originX;
            var originY = this.isTouch ? 0 : this.originY;

            movementX = this.axis === 'y' ? 0 : (x - originX / 50) * strength;
            movementY = this.axis === 'x' ? 0 : (y - originY / 50) * strength;
          }

          if (isScroll) {
            var scrollMovement = context.scrollPosition * strength;

            movementX = this.axis === 'x' ? scrollMovement : 0;
            movementY = this.axis === 'y' || !this.axis ? scrollMovement : 0;
          }

          if (this.maxX) {
            movementX = Math.min(movementX, this.maxX);
          }
          if (this.minX) {
            movementX = Math.max(movementX, this.minX);
          }
          if (this.maxY) {
            movementY = Math.min(movementY, this.maxY);
          }
          if (this.minY) {
            movementY = Math.max(movementY, this.minY);
          }
        } else if (this.cycle > 0) {
          var ref$2 = context.cycleMovement;
          var x$1 = ref$2.x;
          var y$1 = ref$2.y;
          var width = ref$2.width;
          var height = ref$2.height;
          var cycleX = width * Math.sin(x$1 * this.cycle);
          var cycleY = height * Math.sin(y$1 * this.cycle);

          movementX = this.axis === 'x' ? (cycleX / (width / 2)) * strength : 0;
          movementY = this.axis === 'y' || !this.axis
            ? (cycleY / (height / 2)) * strength
            : 0;
        }

        var transformType = this.type;

        transformType = transformType === 'scaleX' || transformType === 'scaleY'
          ? 'scale'
          : transformType;

        transform = this.transformSwitch(
          transformType,
          movementX,
          movementY,
          this.strength
        );
        return { transform: transform };
      },
    },
  };

  /* script */
  var __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      _vm.tag,
      {
        tag: "component",
        style: Object.assign({}, _vm.transform, _vm.transformParameters)
      },
      [_vm._t("default")],
      2
    )
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    var __vue_inject_styles__$1 = undefined;
    /* scoped */
    var __vue_scope_id__$1 = undefined;
    /* module identifier */
    var __vue_module_identifier__$1 = undefined;
    /* functional template */
    var __vue_is_functional_template__$1 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$1 = normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$2 = {
    name: 'KinesisAudio',
    inject: ['context'],
    mixins: [motionMixin],
    props: {
      tag: {
        type: String,
        default: 'div',
      },
      audioIndex: {
        type: Number,
        default: 50,
      },
    },
    computed: {
      transform: function transform() {
        return this.transformAudio();
      },
      transformParameters: function transformParameters() {
        return {
          transitionProperty: 'transform',
          transitionDuration: this.transitionDuration,
          transformOrigin: this.transformOrigin,
          transitionTimingFunction: this.transitionTimingFunction,
        };
      },
      transitionDuration: function transitionDuration() {
        var ref = this.context;
        var duration = ref.duration;
        return (duration + "ms");
      },
      transitionTimingFunction: function transitionTimingFunction() {
        return this.context.easing;
      },
    },
    methods: {
      transformAudio: function transformAudio() {
        var ref = this.context;
        var audioData = ref.audioData;

        if (!this.context.audioData) { return; }

        var transformType = this.type;

        var ref$1 = this;
        var strength = ref$1.strength;

        var amplitude; var
          transform;

        switch (transformType) {
          case 'translate':
            amplitude = audioData ? audioData[0][this.audioIndex] : 0;
            transform = "translate3d(" + (amplitude * strength) + "px, 0, 0)";
            break;
          case 'rotate':
            amplitude = audioData ? audioData[0][this.audioIndex] : 0;
            transform = "rotate3d(0,0,1," + ((amplitude * strength) / 10) + "deg)";
            break;
          case 'scale':
            amplitude = audioData
              ? audioData[0][this.audioIndex] / strength < 1
                ? 1
                : audioData[0][this.audioIndex] / (strength * 2)
              : 1;
            transform = "scale(" + amplitude + ")";
            break;
        }

        return { transform: transform };
      },
    },
  };

  /* script */
  var __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      _vm.tag,
      {
        tag: "component",
        style: Object.assign({}, _vm.transform, _vm.transformParameters)
      },
      [_vm._t("default")],
      2
    )
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    var __vue_inject_styles__$2 = undefined;
    /* scoped */
    var __vue_scope_id__$2 = undefined;
    /* module identifier */
    var __vue_module_identifier__$2 = undefined;
    /* functional template */
    var __vue_is_functional_template__$2 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$2 = normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$3 = {
    name: 'KinesisScroll',
    mixins: [baseMixin, perspectiveMixin, motionMixin, transformMixin],
    data: function data() {
      return {
        transform: {},
      };
    },
    mounted: function mounted() {
      window.addEventListener('scroll', this.handleScroll, { passive: true });
    },
    beforeDestroy: function beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll, { passive: true });
    },
    computed: {
      transformParameters: function transformParameters() {
        return {
          transitionProperty: 'transform',
          transitionDuration: this.transitionDuration,
          transformOrigin: this.transformOrigin,
          transitionTimingFunction: this.easing,
        };
      },
      transitionDuration: function transitionDuration() {
        return ((this.duration) + "ms");
      },
    },
    methods: {
      getCycleMovement: function getCycleMovement(xPos, yPos, width, height, shape) {
        var x = ((xPos - shape.left) * (Math.PI * 2)) / width;
        var y = ((yPos - shape.top) * (Math.PI * 2)) / height;

        this.cycleMovement = {
          x: x, y: y, width: width, height: height,
        };
      },
      handleScroll: throttle(
        function () {
          if (!this.active) { return; }
          var shape = this.$el.getBoundingClientRect();
          var isInViewport = inViewport(shape);
          if (isInViewport && !!shape.height) {
            this.transformBehavior(shape);
          }
        },
        19,
        'scroll'
      ),
      transformBehavior: function transformBehavior(shape) {
        var movementX; var movementY; var
          transform;
        var scrollPosition = (shape.top - window.innerHeight) / (shape.height + window.innerHeight);
        if (this.cycle <= 0) {
          var scrollMovement = scrollPosition * this.strength;

          movementX = this.axis === 'x' ? scrollMovement : 0;
          movementY = this.axis === 'y' || !this.axis ? scrollMovement : 0;

          if (this.maxX) {
            movementX = Math.min(movementX, this.maxX);
          }
          if (this.minX) {
            movementX = Math.max(movementX, this.minX);
          }
          if (this.maxY) {
            movementY = Math.min(movementY, this.maxY);
          }
          if (this.minY) {
            movementY = Math.max(movementY, this.minY);
          }
        } else if (this.cycle > 0) {
          var ref = this.getCycleMovement(
            0,
            0,
            window.innerWidth,
            window.innerHeight,
            shape
          );
          var x = ref.x;
          var y = ref.y;
          var width = ref.width;
          var height = ref.height;
          var cycleX = width * Math.sin(x * this.cycle);
          var cycleY = height * Math.sin(y * this.cycle);

          movementX = this.axis === 'x' ? (cycleX / (width / 2)) * this.strength : 0;
          movementY = this.axis === 'y' || !this.axis
            ? (cycleY / (height / 2)) * this.strength
            : 0;
        }

        var transformType = this.type;

        transformType = transformType === 'scaleX' || transformType === 'scaleY'
          ? 'scale'
          : transformType;

        transform = this.transformSwitch(
          transformType,
          movementX,
          movementY,
          this.strength
        );
        this.transform = { transform: transform };
      },
    },
  };

  /* script */
  var __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      _vm.tag,
      {
        tag: "component",
        style: Object.assign({}, _vm.transform, _vm.transformParameters)
      },
      [_vm._t("default")],
      2
    )
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    var __vue_inject_styles__$3 = undefined;
    /* scoped */
    var __vue_scope_id__$3 = undefined;
    /* module identifier */
    var __vue_module_identifier__$3 = undefined;
    /* functional template */
    var __vue_is_functional_template__$3 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$3 = normalizeComponent(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      false,
      undefined,
      undefined,
      undefined
    );

  //

  var script$4 = {
    name: 'KinesisDistance',
    props: {
      tag: {
        type: String,
        default: 'div',
      },
      type: {
        type: String,
        default: 'translate', // translate, rotate, scale, scaleX, scaleY, depth, custom
      },
      transformOrigin: {
        type: String,
        default: 'center',
      },
      originX: {
        type: Number,
        default: 50,
      },
      originY: {
        type: Number,
        default: 50,
      },
      strength: {
        type: Number,
        default: 10,
      },
      axis: {
        type: String,
        default: null,
      },
      maxX: {
        type: Number,
        default: null,
      },
      maxY: {
        type: Number,
        default: null,
      },
      minX: {
        type: Number,
        default: null,
      },
      minY: {
        type: Number,
        default: null,
      },
      distance: {
        type: Number,
        default: 100,
      },
      cycle: {
        type: Number,
        default: 0,
      },
      active: {
        type: Boolean,
        default: true,
      },
      duration: {
        type: Number,
        default: 1001,
      },
      easing: {
        type: String,
        default: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      perspective: {
        type: Number,
        default: 1000,
      },
    },
    data: function data() {
      return {
        pointer: {
          x: 0,
          y: 0,
        },
        transform: {},
        component: 'kidistance',
        throttle: 500,
      };
    },
    mounted: function mounted() {
      window.addEventListener('scroll', this.handleMovement);
    },
    beforeDestroy: function beforeDestroy() {
      window.removeEventListener('scroll', this.handleMovement);
    },
    computed: {
      style: function style() {
        return { perspective: ((this.perspective) + "px") };
      },
      transformParameters: function transformParameters() {
        return {
          position: 'relative',
          transitionProperty: 'transform',
          transitionDuration: this.transitionDuration,
          transformOrigin: this.transformOrigin,
          transitionTimingFunction: this.easing,
        };
      },
      transitionDuration: function transitionDuration() {
        return ((this.duration) + "ms");
      },
    },
    methods: {
      getCoordinates: function getCoordinates(x, y) {
        var shape = this.$el.getBoundingClientRect();
        return { x: x + shape.left, y: y + shape.top };
      },
      getDistance: function getDistance(x1, x2, y1, y2) {
        return Math.floor(Math.hypot(x2 - x1, y2 - y1));
      },
      handleMovement: throttle(function (event) {
        window.addEventListener('mousemove', this.handleMovement);

        var ref = this;
        var pointer = ref.pointer;
        pointer.x = event.clientX;
        pointer.y = event.clientY;

        this.transformBehavior();
      }, 50),
      transformBehavior: function transformBehavior() {
        var shape = this.$el.getBoundingClientRect();

        var center = this.getCoordinates(shape.width / 2, shape.height / 2);
        var distance = this.getDistance(
          this.pointer.x,
          center.x,
          this.pointer.y,
          center.y
        );

        if (distance > this.distance) {
          this.transform = {};
          this.throttle = 500;

          return;
        }
        this.throttle = 50;

        var transform = "scale(" + (distance / this.distance) + ")";

        // Add radius from which the transfrom will start

        this.transform = { transform: transform };
      },
      scaleMovement: function scaleMovement(x, y) {
        var ref = this;
        var type = ref.type;
        var movement = (Math.sign(this.strength) * (Math.abs(x) + Math.abs(y))) / 10 + 1;
        return ("scale3d(" + (type === 'scaleX' || type === 'scale' ? movement : 1) + ",\n      " + (type === 'scaleY' || type === 'scale' ? movement : 1) + ",\n      1)");
      },
    },
  };

  /* script */
  var __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$4 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      _vm.tag,
      {
        tag: "component",
        style: Object.assign({}, _vm.transform, _vm.transformParameters)
      },
      [_vm._t("default")],
      2
    )
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

    /* style */
    var __vue_inject_styles__$4 = undefined;
    /* scoped */
    var __vue_scope_id__$4 = undefined;
    /* module identifier */
    var __vue_module_identifier__$4 = undefined;
    /* functional template */
    var __vue_is_functional_template__$4 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$4 = normalizeComponent(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      false,
      undefined,
      undefined,
      undefined
    );

  var Plugin = {
    install: function install(Vue) {
      Vue.component(__vue_component__$2.name, __vue_component__$2);
    },
  };

  var GlobalVue = null;

  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(Plugin);
  }

  var Plugin$1 = {
    install: function install(Vue) {
      Vue.component(__vue_component__.name, __vue_component__);
    },
  };

  var GlobalVue$1 = null;

  if (typeof window !== 'undefined') {
    GlobalVue$1 = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue$1 = global.Vue;
  }

  if (GlobalVue$1) {
    GlobalVue$1.use(Plugin$1);
  }

  var Plugin$2 = {
    install: function install(Vue) {
      Vue.component(__vue_component__$4.name, __vue_component__$4);
    },
  };

  var GlobalVue$2 = null;

  if (typeof window !== 'undefined') {
    GlobalVue$2 = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue$2 = global.Vue;
  }

  if (GlobalVue$2) {
    GlobalVue$2.use(Plugin$2);
  }

  var Plugin$3 = {
    install: function install(Vue) {
      Vue.component(__vue_component__$1.name, __vue_component__$1);
    },
  };

  var GlobalVue$3 = null;

  if (typeof window !== 'undefined') {
    GlobalVue$3 = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue$3 = global.Vue;
  }

  if (GlobalVue$3) {
    GlobalVue$3.use(Plugin$3);
  }

  var Plugin$4 = {
    install: function install(Vue) {
      Vue.component(__vue_component__$3.name, __vue_component__$3);
    },
  };

  var GlobalVue$4 = null;

  if (typeof window !== 'undefined') {
    GlobalVue$4 = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue$4 = global.Vue;
  }

  if (GlobalVue$4) {
    GlobalVue$4.use(Plugin$4);
  }



  var components = /*#__PURE__*/Object.freeze({
    __proto__: null,
    KinesisAudio: Plugin,
    KinesisContainer: Plugin$1,
    KinesisDistance: Plugin$2,
    KinesisElement: Plugin$3,
    KinesisScroll: Plugin$4
  });

  /* eslint-disable */

  var install = function (Vue) {
    if (install.installed) {
      return;
    }
    install.installed = true;

    for (var name in components) {
      Vue.use(components[name]);
    }

    Vue.component('kinesis-container', __vue_component__);
    Vue.component('kinesis-element', __vue_component__$1);
    Vue.component('kinesis-audio', __vue_component__$2);
    Vue.component('kinesis-scroll', __vue_component__$3);
    Vue.component('kinesis-distance', __vue_component__$4);
  };

  var Plugin$5 = { install: install };

  var GlobalVue$5 = null;

  if (typeof window !== 'undefined') {
    GlobalVue$5 = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue$5 = global.Vue;
  }

  if (GlobalVue$5) {
    GlobalVue$5.use(Plugin$5);
  }

  exports.KinesisAudio = __vue_component__$2;
  exports.KinesisContainer = __vue_component__;
  exports.KinesisDistance = __vue_component__$4;
  exports.KinesisElement = __vue_component__$1;
  exports.KinesisScroll = __vue_component__$3;
  exports.default = Plugin$5;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
