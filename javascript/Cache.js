var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.cache = (function() {
  'use strict';

  var STORAGE_PREFIX = 'EIGENFACTORIZER:',
    // cache successful lookups for 7 days
    successTimeout = 1000 * 3600 * 24 * 7,
    // cache successful lookups for 1 hour
    failureTimeout = 1000 * 3600,
    log = EIGENFACTORIZER.logger.log;

  function getTimeout() {
    return { success: successTimeout,
             failure: failureTimeout };
  }

  function setTimeout(successMillisec, failureMillisec) {
    successTimeout = successMillisec;
    failureTimeout = failureMillisec;
  }

  function getStorageKey(title) {
    return STORAGE_PREFIX + title;
  }

  function saveToCache(title, info, timestamp) {
    var key = getStorageKey(title),
      value;
    // Never cache null so we can differentiate an cache miss from a
    // cached failure
    if (info === null) {
      info = undefined;
    }
    value = JSON.stringify({info: info,
                            timestamp: timestamp || new Date().getTime()});
    log('Saving ' + key + ' => ' + value);
    localStorage.setItem(key, value);
  }

  function getFromCache(title, timestamp) {
    var key = getStorageKey(title),
      value = localStorage.getItem(key),
      age;

    log('Loading ' + key + ' => ' + value);
    if (value) {
      value = JSON.parse(value);
      age = (timestamp || new Date().getTime()) - value.timestamp;
      if (age < (value.info ? successTimeout : failureTimeout)) {
        log('Returning ' + JSON.stringify(value.info));
        return value.info;
      }
      log('Expired ' + JSON.stringify(value.info));
      localStorage.removeItem(key);
    }
    log('Returning null');
    return null;
  }

  function countCachedItems() {
    var count = 0,
      i,
      key;
    for (i = localStorage.length - 1; i >= 0; i -= 1) {
      key = localStorage.key(i);
      if (key.indexOf(STORAGE_PREFIX) === 0) {
        count += 1;
      }
    }
    return count;
  }

  // Inspired by the flush method from lscache:
  //   https://github.com/pamelafox/lscache
  function clearCache() {
    var i,
      key;
    // Removing items will change indices above, so loop in reverse
    for (i = localStorage.length - 1; i >= 0; i -= 1) {
      key = localStorage.key(i);
      if (key.indexOf(STORAGE_PREFIX) === 0) {
        localStorage.removeItem(key);
      }
    }
  }

  return {
    getStorageKey: getStorageKey,
    getTimeout: getTimeout,
    setTimeout: setTimeout,
    saveToCache: saveToCache,
    getFromCache: getFromCache,
    countCachedItems: countCachedItems,
    clearCache: clearCache
  };
}());
