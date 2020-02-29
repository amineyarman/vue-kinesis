/* eslint-disable default-case */
export default {
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
      const { type } = this;
      const movement = (Math.sign(this.strength) * (Math.abs(x) + Math.abs(y))) / 10 + 1;
      return `scale3d(${type === 'scaleX' || type === 'scale' ? movement : 1},
            ${type === 'scaleY' || type === 'scale' ? movement : 1},
            1)`;
    },
  },
};
