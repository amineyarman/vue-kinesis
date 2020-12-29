function inViewport(element) {
  const isInViewport = element.bottom >= 0 && element.right >= 0 && element.top <= (window.innerHeight || document.documentElement.clientHeight) && element.left <= (window.innerWidth || document.documentElement.clientWidth);
  return isInViewport;
}

function throttle(callback, delay, type) {
  let last;
  let timer; // eslint-disable-next-line func-names

  return function () {
    const context = this;
    let newDelay;

    if (type === 'scroll') {
      newDelay = delay;
    } else {
      newDelay = context.duration > 1000 ? delay : context.duration / 10;
    }

    const now = +new Date(); // eslint-disable-next-line prefer-rest-params

    const args = arguments;

    if (last && now < last + newDelay) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        requestAnimationFrame(() => {
          last = now;
          callback.apply(context, args);
        });
      }, newDelay);
    } else {
      requestAnimationFrame(() => {
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
      default: true
    },
    duration: {
      type: Number,
      default: 1000
    },
    easing: {
      type: String,
      default: 'cubic-bezier(0.23, 1, 0.32, 1)'
    },
    tag: {
      type: String,
      default: 'div'
    }
  }
};

var perspectiveMixin = {
  props: {
    perspective: {
      type: Number,
      default: 1000
    }
  },
  computed: {
    style() {
      return {
        perspective: `${this.perspective}px`
      };
    }

  }
};

var audioMixin = {
  props: {
    audio: {
      type: String,
      required: false
    },
    playAudio: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      analyser: null,
      audioArray: null,
      audioData: null,
      audioRef: null,
      wasPlayed: false,
      isPlaying: false
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
    }

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
      const {
        audio
      } = this.$refs;
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
    }

  }
};

function isTouch() {
  try {
    return /Mobi|Android/i.test(navigator.userAgent);
  } catch (e) {
    return true;
  }
}

var containerEvents = {
  props: {
    event: {
      type: String,
      default: 'move' // move, scroll

    }
  },

  data() {
    return {
      eventMap: {
        orientation: 'deviceorientation',
        scroll: 'scroll',
        move: isTouch() ? 'deviceorientation' : null
      }
    };
  },

  methods: {
    addEvents() {
      if (this.eventMap[this.event]) {
        window.addEventListener(this.eventMap[this.event], this.handleMovement, true);
      }
    },

    removeEvents() {
      if (this.eventMap[this.event]) {
        window.removeEventListener(this.eventMap[this.event], this.handleMovement, true);
      }
    }

  },
  watch: {
    event(newVal, oldVal) {
      if (this.eventMap[newVal]) {
        window.addEventListener(this.eventMap[newVal], this.handleMovement, true);
      }

      if (this.eventMap[oldVal]) {
        window.addEventListener(this.eventMap[oldVal], this.handleMovement, true);
      }
    }

  }
};

function getCoordinates (x, y) {
  return {
    x,
    y
  };
}

function getCenter (element) {
  return getCoordinates(element ? element.width / 2 : 0, element ? element.height / 2 : 0);
}

function mouseMovement (action) {
  const {
    target,
    event
  } = action;
  const x = event.clientX;
  const y = event.clientY;
  const relativeX = x - target.left;
  const relativeY = y - target.top;
  const center = getCenter(target);
  const mouseMovementX = relativeX / center.x;
  const mouseMovementY = relativeY / center.y;
  return { ...getCoordinates(mouseMovementX, mouseMovementY),
    target
  };
}

function orientationElement (action) {
  const {
    event,
    target
  } = action;
  const x = event.gamma / 45;
  const y = event.beta / 90;
  return { ...getCoordinates(x, y),
    target
  };
}

function scrollMovement (target) {
  const x = (target.left - window.innerWidth) / (target.width + window.innerWidth);
  const y = (target.top - window.innerHeight) / (target.height + window.innerHeight);
  return { ...getCoordinates(x, y),
    target
  };
}

//
var script = {
  name: 'KinesisContainer',
  mixins: [baseMixin, perspectiveMixin, audioMixin, containerEvents],

  provide() {
    const context = {};
    const providedProps = ['audioData', 'duration', 'easing', 'event', 'eventData', 'isMoving', 'movement', 'shape'];
    providedProps.forEach(prop => Object.defineProperty(context, prop, {
      enumerable: true,
      get: () => this[prop]
    }));
    return {
      context
    };
  },

  data() {
    return {
      movement: {
        x: 0,
        y: 0
      },
      leftOnce: false,
      isMoving: false,
      shape: null,
      eventData: {
        x: 0,
        y: 0
      }
    };
  },

  mounted() {
    this.addEvents();
  },

  beforeDestroy() {
    this.removeEvents();
  },

  methods: {
    // eslint-disable-next-line func-names
    handleMovement: throttle(function (event) {
      // if (!this.active) return;
      if (!this.isMoving && !this.leftOnce) {
        //fixes the specific case when mouseenter didn't trigger on page refresh
        this.isMoving = true;
      }

      this.shape = this.$el.getBoundingClientRect();
      const isInViewport = inViewport(this.shape);

      if (this.event === 'move' && this.isMoving && !isTouch()) {
        this.movement = mouseMovement({
          target: this.shape,
          event
        });
        this.eventData = getCoordinates(event.clientX, event.clientY);
      } else if ((this.event === 'orientation' || this.event === 'move' && isTouch()) && isInViewport) {
        this.movement = orientationElement({
          target: this.shape,
          event
        });
      } else if (this.event === 'scroll' && isInViewport && !!this.shape.height) {
        this.movement = scrollMovement(this.shape);
      }
    }, 100),

    handleMovementStart() {
      this.isMoving = true;
    },

    handleMovementStop() {
      this.leftOnce = true; //fixes the specific case when mouseenter didn't trigger on page refresh

      this.isMoving = false;
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
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
    let hook;
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
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c(_vm.tag, {
    tag: "component",
    style: _vm.style,
    on: {
      "mousemove": _vm.handleMovement,
      "mouseenter": _vm.handleMovementStart,
      "mouseleave": _vm.handleMovementStop
    }
  }, [_vm._t("default"), _vm._v(" "), _vm.audio ? _c('audio', {
    ref: "audio",
    attrs: {
      "type": "audio/mpeg"
    },
    on: {
      "ended": _vm.stop
    }
  }, [_c('source', {
    attrs: {
      "src": _vm.audio
    }
  })]) : _vm._e()], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = undefined;
/* scoped */

const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

var motionMixin = {
  props: {
    type: {
      type: String,
      default: 'translate' // translate, rotate, scale, scaleX, scaleY, depth, depth_inv, custom

    },
    transformOrigin: {
      type: String,
      default: 'center'
    },
    originX: {
      type: Number,
      default: 50
    },
    originY: {
      type: Number,
      default: 50
    },
    strength: {
      type: Number,
      default: 10
    },
    audioIndex: {
      type: Number,
      default: 50
    },
    axis: {
      type: String,
      default: null
    },
    maxX: {
      type: Number,
      default: null
    },
    maxY: {
      type: Number,
      default: null
    },
    minX: {
      type: Number,
      default: null
    },
    minY: {
      type: Number,
      default: null
    },
    cycle: {
      type: Number,
      default: 0
    }
  },
  methods: {
    strengthManager() {
      return this.type === 'depth' || this.type === 'depth_inv' ? Math.abs(this.strength) : this.strength;
    }

  }
};

/* eslint-disable default-case */
var transformMixin = {
  methods: {
    transformSwitch(type, x, y, s) {
      let transform;

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

    translateMovement(x, y) {
      return `translate3d(${-x}px, ${-y}px, 0)`;
    },

    rotateMovement(x, y) {
      let movement;

      if (!this.axis) {
        movement = x + y;
      } else if (this.axis === 'x') {
        movement = 2 * x;
      } else if (this.axis === 'y') {
        movement = 2 * y;
      }

      return `rotate3d(0,0,1,${movement}deg)`;
    },

    depthMovement(x, y, s) {
      return `rotateX(${-y}deg) rotateY(${x}deg) translate3d(0,0,${s * 2}px)`;
    },

    scaleMovement(x, y) {
      const {
        type
      } = this;
      const movement = Math.sign(this.strength) * (Math.abs(x) + Math.abs(y)) / 10 + 1;
      return `scale3d(${type === 'scaleX' || type === 'scale' ? movement : 1},
            ${type === 'scaleY' || type === 'scale' ? movement : 1},
            1)`;
    }

  }
};

function elementMovement (action) {
  const {
    y,
    x,
    target,
    originX = 50,
    strength = 10,
    event = null
  } = action;
  let {
    originY = 50
  } = action;

  if (event === 'scroll') {
    originY = -originY / 2;
  }

  const movementX = (x - originX / 50) * strength;
  const movementY = (y - originY / 50) * strength;
  return { ...getCoordinates(movementX, movementY),
    target
  };
}

/* eslint-disable no-nested-ternary */
function clamp (value, min, max) {
  return max && value > max ? max : min && value < min ? min : value;
}

function cyclicMovement (cycleData) {
  const {
    referencePosition,
    elementPosition,
    spanningRange,
    cycles
  } = cycleData;
  const radialPosition = (referencePosition - elementPosition) * (Math.PI * 2) / spanningRange;
  const cycle = spanningRange * Math.sin(radialPosition * cycles);
  return cycle / (spanningRange / 2);
}

//
var script$1 = {
  name: 'KinesisElement',
  mixins: [motionMixin, transformMixin],
  inject: ['context'],
  props: {
    tag: {
      type: String,
      default: 'div'
    }
  },
  computed: {
    transform() {
      return this.transformMovement();
    },

    getContext() {
      return this.context;
    },

    transformParameters() {
      return {
        transitionProperty: 'transform',
        transitionDuration: this.transitionDuration,
        transformOrigin: this.transformOrigin,
        transitionTimingFunction: this.transitionTimingFunction
      };
    },

    transitionDuration() {
      const {
        duration
      } = this.context;
      return `${duration}ms`;
    },

    transitionTimingFunction() {
      return this.context.easing;
    },

    isTouch() {
      return isTouch();
    }

  },
  methods: {
    transformMovement() {
      const {
        context
      } = this;
      if (!context.isMoving && context.event === 'move') return {};
      let movementX;
      let movementY;
      const eventTrigger = context.event;
      const strength = this.strengthManager();

      if (this.cycle <= 0) {
        const {
          x,
          y
        } = elementMovement({ ...context.movement,
          originX: this.originX,
          originY: this.originY,
          strength
        });
        const isScroll = eventTrigger === 'scroll';

        if (!isScroll) {
          movementX = this.axis === 'y' ? 0 : clamp(x, this.minX, this.maxX);
          movementY = this.axis === 'x' ? 0 : clamp(y, this.minY, this.maxY);
        }

        if (isScroll) {
          const scrollMovement = elementMovement({
            x: context.movement.x,
            y: context.movement.y,
            originX: this.originX,
            originY: this.originY,
            strength,
            event: context.event
          }).y;
          movementX = this.axis === 'x' ? scrollMovement : 0;
          movementY = this.axis === 'y' || !this.axis ? scrollMovement : 0;
        }
      } else if (this.cycle > 0) {
        const {
          shape,
          eventData
        } = context;

        if (shape) {
          const cycleX = this.axis === 'x' ? cyclicMovement({
            referencePosition: eventTrigger === 'scroll' ? 0 : eventData.x,
            elementPosition: shape.left,
            spanningRange: eventTrigger === 'scroll' ? window.innerWidth : shape.width,
            cycles: this.cycle
          }) : 0;
          const cycleY = this.axis === 'y' || !this.axis ? cyclicMovement({
            referencePosition: eventTrigger === 'scroll' ? 0 : eventData.y,
            elementPosition: shape.top,
            spanningRange: eventTrigger === 'scroll' ? window.innerHeight : shape.height,
            cycles: this.cycle
          }) : 0;
          movementX = cycleX * strength;
          movementY = cycleY * strength;
        }
      }

      let transformType = this.type;
      transformType = transformType === 'scaleX' || transformType === 'scaleY' ? 'scale' : transformType;
      const transform = this.transformSwitch(transformType, movementX, movementY, this.strength);
      return {
        transform
      };
    }

  }
};

/* script */
const __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c(_vm.tag, {
    tag: "component",
    style: Object.assign({}, _vm.transform, _vm.transformParameters)
  }, [_vm._t("default")], 2);
};

var __vue_staticRenderFns__$1 = [];
/* style */

const __vue_inject_styles__$1 = undefined;
/* scoped */

const __vue_scope_id__$1 = undefined;
/* module identifier */

const __vue_module_identifier__$1 = undefined;
/* functional template */

const __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

//
var script$2 = {
  name: 'KinesisAudio',
  inject: ['context'],
  mixins: [motionMixin],
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    audioIndex: {
      type: Number,
      default: 50
    }
  },
  computed: {
    transform() {
      return this.transformAudio();
    },

    transformParameters() {
      return {
        transitionProperty: 'transform',
        transitionDuration: this.transitionDuration,
        transformOrigin: this.transformOrigin,
        transitionTimingFunction: this.transitionTimingFunction
      };
    },

    transitionDuration() {
      const {
        duration
      } = this.context;
      return `${duration}ms`;
    },

    transitionTimingFunction() {
      return this.context.easing;
    }

  },
  methods: {
    transformAudio() {
      const {
        audioData
      } = this.context;
      if (!this.context.audioData) return;
      const transformType = this.type;
      const {
        strength
      } = this;
      let amplitude;
      let transform; // eslint-disable-next-line default-case

      switch (transformType) {
        case 'translate':
          amplitude = audioData ? audioData[0][this.audioIndex] : 0;
          transform = `translate3d(${amplitude * strength}px, 0, 0)`;
          break;

        case 'rotate':
          amplitude = audioData ? audioData[0][this.audioIndex] : 0;
          transform = `rotate3d(0,0,1,${amplitude * strength / 10}deg)`;
          break;

        case 'scale':
          // eslint-disable-next-line no-nested-ternary
          amplitude = audioData ? audioData[0][this.audioIndex] / strength < 1 ? 1 : audioData[0][this.audioIndex] / (strength * 2) : 1;
          transform = `scale(${amplitude})`;
          break;
      } // eslint-disable-next-line consistent-return


      return {
        transform
      };
    }

  }
};

/* script */
const __vue_script__$2 = script$2;
/* template */

var __vue_render__$2 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c(_vm.tag, {
    tag: "component",
    style: Object.assign({}, _vm.transform, _vm.transformParameters)
  }, [_vm._t("default")], 2);
};

var __vue_staticRenderFns__$2 = [];
/* style */

const __vue_inject_styles__$2 = undefined;
/* scoped */

const __vue_scope_id__$2 = undefined;
/* module identifier */

const __vue_module_identifier__$2 = undefined;
/* functional template */

const __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$2 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

//
var script$3 = {
  name: 'KinesisScroll',
  mixins: [baseMixin, perspectiveMixin, motionMixin, transformMixin],

  data() {
    return {
      transform: {}
    };
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll, {
      passive: true
    });
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, {
      passive: true
    });
  },

  computed: {
    transformParameters() {
      return {
        transitionProperty: 'transform',
        transitionDuration: this.transitionDuration,
        transformOrigin: this.transformOrigin,
        transitionTimingFunction: this.easing
      };
    },

    transitionDuration() {
      return `${this.duration}ms`;
    }

  },
  methods: {
    getCycleMovement(xPos, yPos, width, height, shape) {
      const x = (xPos - shape.left) * (Math.PI * 2) / width;
      const y = (yPos - shape.top) * (Math.PI * 2) / height;
      this.cycleMovement = {
        x,
        y,
        width,
        height
      };
    },

    handleScroll: throttle( // eslint-disable-next-line func-names
    function () {
      if (!this.active) return;
      const shape = this.$el.getBoundingClientRect();
      const isInViewport = inViewport(shape);

      if (isInViewport && !!shape.height) {
        this.transformBehavior(shape);
      }
    }, 19, 'scroll'),

    transformBehavior(shape) {
      let movementX;
      let movementY;
      const scrollPosition = (shape.top - window.innerHeight) / (shape.height + window.innerHeight);

      if (this.cycle <= 0) {
        const scrollMovement = scrollPosition * this.strength;
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
        const {
          x,
          y,
          width,
          height
        } = this.getCycleMovement(0, 0, window.innerWidth, window.innerHeight, shape);
        const cycleX = width * Math.sin(x * this.cycle);
        const cycleY = height * Math.sin(y * this.cycle);
        movementX = this.axis === 'x' ? cycleX / (width / 2) * this.strength : 0;
        movementY = this.axis === 'y' || !this.axis ? cycleY / (height / 2) * this.strength : 0;
      }

      let transformType = this.type;
      transformType = transformType === 'scaleX' || transformType === 'scaleY' ? 'scale' : transformType;
      const transform = this.transformSwitch(transformType, movementX, movementY, this.strength);
      this.transform = {
        transform
      };
    }

  }
};

/* script */
const __vue_script__$3 = script$3;
/* template */

var __vue_render__$3 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c(_vm.tag, {
    tag: "component",
    style: Object.assign({}, _vm.transform, _vm.transformParameters)
  }, [_vm._t("default")], 2);
};

var __vue_staticRenderFns__$3 = [];
/* style */

const __vue_inject_styles__$3 = undefined;
/* scoped */

const __vue_scope_id__$3 = undefined;
/* module identifier */

const __vue_module_identifier__$3 = undefined;
/* functional template */

const __vue_is_functional_template__$3 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$3 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined);

//
var script$4 = {
  name: 'KinesisDistance',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    type: {
      type: String,
      default: 'translate' // translate, rotate, scale, scaleX, scaleY, depth, custom

    },
    transformOrigin: {
      type: String,
      default: 'center'
    },
    originX: {
      type: Number,
      default: 50
    },
    originY: {
      type: Number,
      default: 50
    },
    strength: {
      type: Number,
      default: 10
    },
    axis: {
      type: String,
      default: null
    },
    maxX: {
      type: Number,
      default: null
    },
    maxY: {
      type: Number,
      default: null
    },
    minX: {
      type: Number,
      default: null
    },
    minY: {
      type: Number,
      default: null
    },
    distance: {
      type: Number,
      default: 100
    },
    cycle: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      default: 1001
    },
    easing: {
      type: String,
      default: 'cubic-bezier(0.23, 1, 0.32, 1)'
    },
    perspective: {
      type: Number,
      default: 1000
    }
  },

  data() {
    return {
      pointer: {
        x: 0,
        y: 0
      },
      transform: {},
      component: 'kidistance',
      throttle: 500
    };
  },

  mounted() {
    window.addEventListener('scroll', this.handleMovement);
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleMovement);
  },

  computed: {
    style() {
      return {
        perspective: `${this.perspective}px`
      };
    },

    transformParameters() {
      return {
        position: 'relative',
        transitionProperty: 'transform',
        transitionDuration: this.transitionDuration,
        transformOrigin: this.transformOrigin,
        transitionTimingFunction: this.easing
      };
    },

    transitionDuration() {
      return `${this.duration}ms`;
    }

  },
  methods: {
    getCoordinates(x, y) {
      const shape = this.$el.getBoundingClientRect();
      return {
        x: x + shape.left,
        y: y + shape.top
      };
    },

    getDistance(x1, x2, y1, y2) {
      return Math.floor(Math.hypot(x2 - x1, y2 - y1));
    },

    // eslint-disable-next-line func-names
    handleMovement: throttle(function (event) {
      window.addEventListener('mousemove', this.handleMovement);
      const {
        pointer
      } = this;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      this.transformBehavior();
    }, 50),

    transformBehavior() {
      const shape = this.$el.getBoundingClientRect();
      const center = this.getCoordinates(shape.width / 2, shape.height / 2);
      const distance = this.getDistance(this.pointer.x, center.x, this.pointer.y, center.y);

      if (distance > this.distance) {
        this.transform = {};
        this.throttle = 500;
        return;
      }

      this.throttle = 50;
      const transform = `scale(${distance / this.distance})`; // Add radius from which the transfrom will start

      this.transform = {
        transform
      };
    },

    scaleMovement(x, y) {
      const {
        type
      } = this;
      const movement = Math.sign(this.strength) * (Math.abs(x) + Math.abs(y)) / 10 + 1;
      return `scale3d(${type === 'scaleX' || type === 'scale' ? movement : 1},
      ${type === 'scaleY' || type === 'scale' ? movement : 1},
      1)`;
    }

  }
};

/* script */
const __vue_script__$4 = script$4;
/* template */

var __vue_render__$4 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c(_vm.tag, {
    tag: "component",
    style: Object.assign({}, _vm.transform, _vm.transformParameters)
  }, [_vm._t("default")], 2);
};

var __vue_staticRenderFns__$4 = [];
/* style */

const __vue_inject_styles__$4 = undefined;
/* scoped */

const __vue_scope_id__$4 = undefined;
/* module identifier */

const __vue_module_identifier__$4 = undefined;
/* functional template */

const __vue_is_functional_template__$4 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$4 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, undefined, undefined, undefined);

const Plugin = {
  install(vue) {
    vue.component(__vue_component__$2.name, __vue_component__$2);
    vue.component(__vue_component__.name, __vue_component__);
    vue.component(__vue_component__$4.name, __vue_component__$4);
    vue.component(__vue_component__$1.name, __vue_component__$1);
    vue.component(__vue_component__$3.name, __vue_component__$3);
  }

};
let GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.vue;
}

if (GlobalVue) {
  GlobalVue.use(Plugin);
}

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Plugin,
  KinesisAudio: __vue_component__$2,
  KinesisContainer: __vue_component__,
  KinesisDistance: __vue_component__$4,
  KinesisElement: __vue_component__$1,
  KinesisScroll: __vue_component__$3
});

/* eslint-disable */

const install = function (vue) {
  if (install.installed) {
    return;
  }

  install.installed = true;

  for (const name in components) {
    vue.use(components[name]);
  }

  vue.component('kinesis-container', __vue_component__);
  vue.component('kinesis-element', __vue_component__$1);
  vue.component('kinesis-audio', __vue_component__$2);
  vue.component('kinesis-scroll', __vue_component__$3);
  vue.component('kinesis-distance', __vue_component__$4);
};

const Plugin$1 = {
  install
};
let GlobalVue$1 = null;

if (typeof window !== 'undefined') {
  GlobalVue$1 = window.vue;
} else if (typeof global !== 'undefined') {
  GlobalVue$1 = global.vue;
}

if (GlobalVue$1) {
  GlobalVue$1.use(Plugin$1);
}

export default Plugin$1;
export { __vue_component__$2 as KinesisAudio, __vue_component__ as KinesisContainer, __vue_component__$4 as KinesisDistance, __vue_component__$1 as KinesisElement, __vue_component__$3 as KinesisScroll };
