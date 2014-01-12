var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.lookup = (function() {
  'use strict';

  var cache = EIGENFACTORIZER.cache,
    BaseUrl = 'http://www.eigenfactor.org/pubmed.php',
    log = EIGENFACTORIZER.logger.log;

  function getBaseUrl() {
    return BaseUrl;
  }

  function getRemoteEigenfactors(titles, callback) {
    log('getRemoteEigenfactors for ' + titles);
    var request = new XMLHttpRequest(),
      params = 'journals=' + encodeURIComponent(JSON.stringify(titles));
    request.onreadystatechange = function() {
      var data, info = {}, unknownTitles = [], nTitles = titles.length, i;
      if (request.readyState === 4 && request.status === 200 &&
          request.responseText) {
        data = JSON.parse(request.responseText);
        log('Received journal data:');
        log(data);
        if (data) {
          for (i = 0; i < nTitles; i += 1) {
            cache.saveToCache(titles[i], data[i]);
            if (data[i]) {
              info[titles[i]] = data[i];
            } else {
              unknownTitles.push(titles[i]);
            }
          }
        }
        if (callback) {
          callback(info, unknownTitles);
        }
      }
    };
    request.open('POST', BaseUrl);
    request.setRequestHeader('Content-type',
                             'application/x-www-form-urlencoded');
    //request.setRequestHeader('Content-length', params.length);
    request.send(params);
  }

  function getLocalEigenfactors(titles, callback) {
    log('getLocalEigenfactors for ' + titles);
    var info = {}, unknownTitles = [], nTitles = titles.length,
      i, ob, title;
    for (i = 0; i < nTitles; i += 1) {
      title = titles[i];
      ob = cache.getFromCache(title);
      if (ob !== null) {
        info[title] = ob;
      } else {
        unknownTitles.push(title);
      }
    }
    if (callback) {
      callback(info, unknownTitles);
    }
  }

  return {
    getBaseUrl: getBaseUrl,
    getRemoteEigenfactors: getRemoteEigenfactors,
    getLocalEigenfactors: getLocalEigenfactors
  };

}());
