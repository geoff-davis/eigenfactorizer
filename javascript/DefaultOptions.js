var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.default_options = (function() {
  'use strict';

  var DEFAULT_OPTIONS = { debug: false,
                          show_modal: true,
                          show_color_key: true,
                          show_search: true,
                          show_share: true,
                          show_impact: true,
                          color_scheme: 0};

  function makeComplete(options, defaults) {
    var key;

    if (!defaults) {
      defaults = DEFAULT_OPTIONS;
    }

    if (!options) {
      return defaults;
    }

    // add any missing keys to the object
    for (key in DEFAULT_OPTIONS) {
      if (DEFAULT_OPTIONS.hasOwnProperty(key)) {
        if (!options.hasOwnProperty(key)) {
          if (defaults.hasOwnProperty(key)) {
            options[key] = defaults[key];
          } else {
            options[key] = DEFAULT_OPTIONS[key];
          }
        }
      }
    }
    return options;
  }

  return {
    defaults: DEFAULT_OPTIONS,
    makeComplete: makeComplete
  };
}());


