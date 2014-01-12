var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.color = (function() {
  'use strict';

  var COLOR_SCHEME_PREFIX = 'color-scheme';

  function renderColorScheme(scheme) {
    var body = $('body'),
      classList = body.attr('class');

    if (classList) {
      classList = $(classList.split(/\s+/));
      classList.each(function(n, cl) {
        if (cl.indexOf(COLOR_SCHEME_PREFIX) === 0) {
          body.removeClass(cl);
        }
      });
    }
    body.addClass(COLOR_SCHEME_PREFIX + scheme);
  }

  $('body').append(['<style type="text/css">.eigenfactor0 ',
                    '{ background-image: url("',
                    chrome.extension.getURL('images/stripes-1-4.png'),
                    '"); }</style>'].join(''));

  return {
    renderColorScheme: renderColorScheme
  };

}());
