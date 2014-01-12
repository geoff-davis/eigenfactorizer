var EIGENFACTORIZER = EIGENFACTORIZER || {};

(function() {
  'use strict';

  var logger = EIGENFACTORIZER.logger,
    modal = EIGENFACTORIZER.modal,
    render = EIGENFACTORIZER.render,
    color = EIGENFACTORIZER.color,
    remote_port = EIGENFACTORIZER.remote_port,
    initialSetup = true;

  function optionsListener(msg) {
    if (msg.receiver === 'get-options') {
      var options = msg.options;

      logger.enable(options.debug);
      color.renderColorScheme(options.color_scheme);
      render.showPortlets(options);

      if (initialSetup) {
        initialSetup = false;
        if (options.show_modal) {
          modal.show();
        }
      }
    }
  }

  function postProcess() {
    render.addToolTips();
  }

  function renderJournalsLocal(msg) {
    if (msg.receiver === 'journal-lookup-local') {
      render.updatePage(msg.allJournalInfo);

      // Are there any more titles to look up?
      if (msg.unknownTitles.length > 0) {
        logger.log('Titles not in local storage: ' +
                   msg.unknownTitles);
        // second call gets journals from eigenfactor.org
        remote_port.postMessage({receiver: 'journal-lookup-remote',
                                 titles: msg.unknownTitles});
      } else {
        // all the results are in - do post-processing
        postProcess();
      }
    }
  }

  function renderJournalsRemote(msg) {
    if (msg.receiver === 'journal-lookup-remote') {
      render.updatePage(msg.allJournalInfo);
      if (msg.unknownTitles.length > 0) {
        logger.log('Titles not in eigenfactor.org: ' +
                   msg.unknownTitles);
      }
      postProcess();
    }
  }

  remote_port.addListener(renderJournalsLocal);
  remote_port.addListener(renderJournalsRemote);
  remote_port.addListener(optionsListener);

  render.render(remote_port);
}());
