import jsdom from 'jsdom';
import chai from 'chai';

const doc = jsdom.jsdom('<!doctype html><html><body><div class="" data-api-path="http://127.0.0.1:7777/api"></div></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;

// Supress error messages from the application
console.error = function() {}
console.warn = function() {}

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});

global.nocacheImport = function(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
};
