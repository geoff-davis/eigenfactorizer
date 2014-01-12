var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.modal = (function() {
  'use strict';

  var option_source = EIGENFACTORIZER.remote_option_source;

  function getModal() {
    var modal = $('#eigenfactorizer-modal');

    if (modal.length > 0) {
      return modal.first();
    }
    $('body').append([
      '<div id="eigenfactorizer-modal" class="modal hide">',
        '<div style="padding: 3px;">',
          '<div class="modal-header">',
            '<a class="btn btn-primary" id="close-button" ',
              'href="">Close</a>',
            '<img id="brain" src="',
              chrome.extension.getURL('images/eigenfactor32.png'),
              '" width="28" height="32" />',
            '<h3>PubMed - with Eigenfactorizer</h3>',
          '</div>',
          '<iframe id="modal-iframe" scrolling="auto" src="',
            chrome.extension.getURL('html/modal.html'),
            '" seamless></iframe>',
        '</div>',
      '</div>'].join(''));
    $('#eigenfactorizer-modal').on('shown', function(e) {
      var modal = $(this),
        top = Math.max(Math.floor(($(window).innerHeight() -
                                   modal.outerHeight()) / 2), 0),
        left = Math.max(Math.floor(($(window).innerWidth() -
                                    modal.outerWidth()) / 2), 0);
      modal.css('top', top).css('left', left);
      return this;
    });

    $('#close-button').click(function(e) {
      e.preventDefault();
      hide();
      option_source.setOptions({show_modal: false});
    });
    return $('#eigenfactorizer-modal').first();
  }

  function show() {
    $(getModal()).modal('show');
  }

  function hide() {
    $(getModal()).modal('hide');
  }

  return {
    show: show,
    hide: hide
  };
}());
