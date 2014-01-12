var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.local_option_source = (function() {
  'use strict';

  var default_options = EIGENFACTORIZER.default_options,
    OPTIONS_KEY = 'eigenfactorizer-options';

  function getOptions() {
    var options = localStorage.getItem(OPTIONS_KEY);
    if (options !== null) {
      options = JSON.parse(options);
    }
    return default_options.makeComplete(options);
  }

  function setOptions(opt) {
    default_options.makeComplete(opt, getOptions());
    localStorage.setItem(OPTIONS_KEY, JSON.stringify(opt));
  }

  return {
    getOptions: getOptions,
    setOptions: setOptions
  };
}());
