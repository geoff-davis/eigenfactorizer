var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.render = (function() {
  'use strict';

  var base = EIGENFACTORIZER.render_base,
    renderers = [EIGENFACTORIZER.render_pubmed,
                 EIGENFACTORIZER.render_pubmed_central],
    nRenderers = renderers.length,
    renderer = null;

  function addToolTips() {
    if (renderer) {
      return renderer.addToolTips();
    }
  }

  function showPortlets(options) {
    if (renderer) {
      return renderer.showPortlets(options);
    }
  }

  function updatePage(allJournalInfo) {
    var items = document.querySelectorAll('.unknown-eigenfactor'),
      nItems = items.length,
      i,
      item,
      title,
      year,
      journalInfo,
      closest,
      newClass,
      longTitle;

    for (i = 0; i < nItems; i += 1) {
      item = items[i];
      title = item.getAttribute('journal');
      year = item.getAttribute('year');
      journalInfo = allJournalInfo[title];
      if (journalInfo) {
        item.classList.remove('unknown-eigenfactor');
        item.setAttribute('href', journalInfo.url);
        longTitle = journalInfo.longname;
        closest = base.getClosestData(journalInfo, year);
        if (closest) {
          newClass = 'eigenfactor' + closest.colorcode;
          if (newClass !== 'eigenfactor0') {
            item.classList.remove('eigenfactor0');
            item.classList.add(newClass);
          }
          longTitle += ' - ' + base.INFLUENCE[closest.colorcode];
        }
        item.setAttribute('title', longTitle);
      }
    }
  }

  function render(remote_port) {
    if (renderer) {
      renderer.render(remote_port);
    }
  }

  function initialize() {
    var i, r;
    for (i = 0; i < nRenderers; i += 1) {
      r = renderers[i];
      if (r.isApplicable()) {
        renderer = r;
        renderer.initialize();
        break;
      }
    }
  }

  initialize();


  return {
    addToolTips: addToolTips,
    showPortlets: showPortlets,
    updatePage: updatePage,
    render: render,
    INFLUENCE: base.INFLUENCE
  };

}());
