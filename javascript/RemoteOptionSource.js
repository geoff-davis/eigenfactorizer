var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.remote_option_source = (function() {
  'use strict';

  var default_options = EIGENFACTORIZER.default_options,
    remote_port = EIGENFACTORIZER.remote_port,
    options = default_options;

  function getOptions() {
    return options;
  }

  function setLocalOptions(opt) {
    options = opt;
  }

  function setRemoteOptions(opt) {
    // set options on background page
    remote_port.postMessage({receiver: 'set-options',
                             options: opt});
  }

  function setOptions(opt) {
    opt = default_options.makeComplete(opt, options);
    setLocalOptions(opt);
    setRemoteOptions(opt);
  }

  function updateOptionsListener(msg) {
    if (msg.receiver === 'get-options') {
      setLocalOptions(msg.options);
    }
  }

  remote_port.addListener(updateOptionsListener);
  remote_port.postMessage({receiver: 'get-options'});

  return {
    getOptions: getOptions,
    setOptions: setOptions
  };
}());
