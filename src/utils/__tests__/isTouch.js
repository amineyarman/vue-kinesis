import isTouch from '../isTouch';

const userAgents = {
  mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
  desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
};

describe('isTouch', () => {
  it('Mobile', () => {
    navigator.userAgent = userAgents.mobile;
    expect(isTouch()).toBeTruthy();
  });

  it('Desktop', () => {
    navigator.userAgent = userAgents.desktop;
    expect(isTouch()).toBeFalsy();
  });
});
