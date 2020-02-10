import inViewport from '../inViewport';

describe('inViewport', () => {
  let element;
  beforeEach(() => {
    element = document.createElement('div');
    element.className = 'myElement';
  });

  it('is inViewport', () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    wrapper.appendChild(element);
    const shape = element.getBoundingClientRect();
    expect(inViewport(shape)).toBeTruthy();
  });

  it('is not inViewport by the right', () => {
    const shape = element.getBoundingClientRect();
    shape.right = -10;
    expect(inViewport(shape)).toBeFalsy();
  });

  it('is not inViewport by the top', () => {
    const shape = element.getBoundingClientRect();
    shape.top = 769;
    expect(inViewport(shape)).toBeFalsy();
  });

  it('is not inViewport by the left', () => {
    const shape = element.getBoundingClientRect();
    shape.top = 1025;
    expect(inViewport(shape)).toBeFalsy();
  });
});
