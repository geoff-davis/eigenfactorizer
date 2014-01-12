var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.logger = (function() {
  'use strict';

  var loggingMethod;

  function logNothing() {
  }

  function logToConsole(st) {
    console.log(st);
  }

  function log(st) {
    loggingMethod(st);
  }

  function enable(b) {
    loggingMethod = b ? logToConsole : logNothing;
  }

  enable(false);

  return {
    enable: enable,
    log: log
  };

}());
