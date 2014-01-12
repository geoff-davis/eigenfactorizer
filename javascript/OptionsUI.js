var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.options_ui = (function() {
  'use strict';

  var remote_port = EIGENFACTORIZER.remote_port,
    option_source = EIGENFACTORIZER.remote_option_source;

  function showCount() {
    $('#cached-item-count').text(EIGENFACTORIZER.cache.countCachedItems());
  }

  function initClearCache() {
    $('#clear-cache').on('click', function(event) {
      EIGENFACTORIZER.cache.clearCache();
      showCount();
      return false;
    });
  }

  function showDebug(debug) {
    var button = $('#debugging-button');
    button.html(debug ? 'On' : 'Off');
  }

  function initDebug() {
    $('#debugging-button').click(function(event) {
      event.preventDefault();
      var button = $(this),
        opt = option_source.getOptions();
      option_source.setOptions({debug: !opt.debug});
      return false;
    });
  }

  function showModal(modal) {
    var button = $('#modal-button');
    button.html(modal ? 'On' : 'Off');
  }

  function initModal() {
    $('#modal-button').click(function(event) {
      event.preventDefault();
      var button = $(this),
        opt = option_source.getOptions();
      option_source.setOptions({show_modal: !opt.show_modal});
      return false;
    });
  }

  function showColorKey(color_key) {
    var button = $('#color-key-button');
    button.html(color_key ? 'On' : 'Off');
  }

  function initColorKey() {
    $('#color-key-button').click(function(event) {
      event.preventDefault();
      var button = $(this),
        opt = option_source.getOptions();
      option_source.setOptions({show_color_key: !opt.show_color_key});
      return false;
    });
  }

  function showSearch(search) {
    var button = $('#search-button');
    button.html(search ? 'On' : 'Off');
  }

  function initSearch() {
    $('#search-button').click(function(event) {
      event.preventDefault();
      var button = $(this),
        opt = option_source.getOptions();
      option_source.setOptions({show_search: !opt.show_search});
      return false;
    });
  }

  function showShare(share) {
    var button = $('#share-button');
    button.html(share ? 'On' : 'Off');
  }

  function initShare() {
    $('#share-button').click(function(event) {
      event.preventDefault();
      var button = $(this),
        opt = option_source.getOptions();
      option_source.setOptions({show_share: !opt.show_share});
      return false;
    });
  }

  function showImpact(impact) {
    var button = $('#impact-button');
    button.html(impact ? 'On' : 'Off');
  }

  function initImpact() {
    $('#impact-button').click(function(event) {
      event.preventDefault();
      var button = $(this),
        opt = option_source.getOptions();
      option_source.setOptions({show_impact: !opt.show_impact});
      return false;
    });
  }

  function optionsListener(msg) {
    if (msg.receiver === 'get-options') {
      var options = msg.options;
      showCount();
      showDebug(options.debug);
      showModal(options.show_modal);
      showColorKey(options.show_color_key);
      showSearch(options.show_search);
      showShare(options.show_share);
      showImpact(options.show_impact);
    }
  }

  remote_port.addListener(optionsListener);
  initClearCache();
  initDebug();
  initModal();
  initColorKey();
  initSearch();
  initShare();
  initImpact();
}());
