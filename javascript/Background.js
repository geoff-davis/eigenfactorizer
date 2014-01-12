var EIGENFACTORIZER = EIGENFACTORIZER || {};

(function() {
  'use strict';

  var logger = EIGENFACTORIZER.logger,
    lookup = EIGENFACTORIZER.lookup,
    local_option_source = EIGENFACTORIZER.local_option_source,
    IGNORED_EXCEPTION = 'Attempting to use a disconnected port object',
    ports = [];

  function updateOptions() {
    var activePorts = [],
      nPorts = ports.length,
      port,
      i;
    for (i = 0; i < nPorts; i += 1) {
      try {
        port = ports[i];
        port.postMessage({receiver: 'get-options',
                          options: local_option_source.getOptions()});
        activePorts.push(port);
      } catch (err) {
        if (err.message !== IGNORED_EXCEPTION) {
          throw err;
        }
      }
    }
    ports = activePorts;
  }

  function updateLogger(msg) {
    // Update logger settings every time we
    // get a request from the browser
    logger.enable(local_option_source.getOptions().debug);
  }

  chrome.extension.onConnect.addListener(function(port) {
    ports.push(port);

    function getOptions(msg) {
      if (msg.receiver === 'get-options') {
        try {
          port.postMessage({receiver: 'get-options',
                            options: local_option_source.getOptions()});
        } catch (err) {
          if (err.message !== IGNORED_EXCEPTION) {
            throw err;
          }
        }
      }
    }

    function setOptions(msg) {
      if (msg.receiver === 'set-options') {
        local_option_source.setOptions(msg.options);
        updateOptions();
      }
    }

    function journalLookupLocal(msg) {
      if (msg.receiver === 'journal-lookup-local') {
        lookup.getLocalEigenfactors(
          msg.titles,
          function(allJournalInfo, unknownTitles) {
            try {
              port.postMessage({
                receiver: 'journal-lookup-local',
                unknownTitles: unknownTitles,
                allJournalInfo: allJournalInfo
              });
            } catch (err) {
              if (err.message !== IGNORED_EXCEPTION) {
                throw err;
              }
            }
          }
        );
      }
    }

    function journalLookupRemote(msg) {
      if (msg.receiver === 'journal-lookup-remote') {
        lookup.getRemoteEigenfactors(
          msg.titles,
          function(allJournalInfo, unknownTitles) {
            try {
              port.postMessage({
                receiver: 'journal-lookup-remote',
                source: 'remote',
                unknownTitles: unknownTitles,
                allJournalInfo: allJournalInfo
              });
            } catch (err) {
              if (err.message !== IGNORED_EXCEPTION) {
                throw err;
              }
            }
          }
        );
      }
    }

    port.onMessage.addListener(getOptions);
    port.onMessage.addListener(setOptions);
    port.onMessage.addListener(journalLookupLocal);
    port.onMessage.addListener(journalLookupRemote);
    port.onMessage.addListener(updateLogger);
  });
}());
