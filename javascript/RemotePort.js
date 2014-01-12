var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.remote_port = (function() {
  'use strict';

  var port = chrome.extension.connect({name: 'eigenfactorizer'});

  function addListener(listener) {
    port.onMessage.addListener(listener);
  }

  function postMessage(message) {
    port.postMessage(message);
  }

  return {
    addListener: addListener,
    postMessage: postMessage
  };
}());
