/* eslint-disable no-param-reassign no-return-assign */

import { JSDOM } from 'jsdom';

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;

// MOCK userAgent
// setter --> navigator.userAgent = 'value'
// getter --> navigator.userAgent
const editableFn = _value => ({
  get: () => _value,
  set: v => _value = v,
});

Object.defineProperty(navigator, 'userAgent', editableFn(navigator.userAgent));
