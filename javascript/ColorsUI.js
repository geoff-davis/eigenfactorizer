var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.colors_ui = (function() {
  'use strict';

  var color = EIGENFACTORIZER.color,
    remote_port = EIGENFACTORIZER.remote_port,
    option_source = EIGENFACTORIZER.remote_option_source;

  function showColorScheme(color_scheme) {
    $('#color-scheme').val(color_scheme);
    color.renderColorScheme(color_scheme);
  }

  function initColorScheme() {
    $('#color-scheme').on('change', function(event) {
      var scheme = $(this).val();
      option_source.setOptions({color_scheme: scheme});
    });
  }

  function optionsListener(msg) {
    if (msg.receiver === 'get-options') {
      var options = msg.options;
      showColorScheme(options.color_scheme);
    }
  }

  remote_port.addListener(optionsListener);
  initColorScheme();

}());
