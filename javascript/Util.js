var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.util = (function() {
  'use strict';

  function listProperties(ob) {
    var propList = [], propName, value;
    for (propName in ob) {
      if (ob.hasOwnProperty(propName)) {
        value = ob[propName];
        if (typeof value === 'object') {
          value = listProperties(value).join(', ');
        }
        propList.push(propName + ' = ' + value);
      }
    }
    return propList;
  }

  function strcmp(s1, s2) {
    return s1.localeCompare(s2);
  }

  function uniqueStrings(strings) {
    strings.sort(strcmp);
    var uniques = [],
      nStrings = strings.length,
      nUniques = 0,
      i,
      st;

    if (nStrings === 0) {
      return uniques;
    }

    uniques.push(strings[0]);
    nUniques += 1;
    for (i = 1; i < nStrings; i += 1) {
      st = strings[i];

      if (st !== uniques[nUniques - 1]) {
        uniques.push(st);
        nUniques += 1;
      }
    }
    return uniques;
  }

  function splitAtLastPeriod(s) {
    if (!s) { return [s, s]; }
    // ignore trailing ellipses
    if (/\.\.\.$/.test(s)) { s = s.slice(0, -3); }
    var index = s.lastIndexOf('.');
    if (index === -1) { index = s.length; }
    return [s.substring(0, index), s.substring(index + 1, s.length)];
  }

  function removeHTML(s) {
    return s.replace(/<[^>]+>/gm, '');
  }

  function trim(s) {
    if (!s) { return s; }
    return s.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  function truncateAtWordBoundary(s, maxlen) {
    var words = s.split(/\b/),
      nwords = words.length,
      truncated = [],
      len = 0,
      i,
      word;

    if (s.length <= maxlen) {
      return s;
    }
    maxlen -= 3;  // allow for ellipsis
    for (i = 0; i < nwords; i += 1) {
      word = words[i];
      if (len + word.length <= maxlen) {
        truncated.push(word);
        len += word.length;
      } else {
        // get rid of trailing whitespace
        if (/^\s+$/.test(truncated[truncated.length - 1])) {
          truncated.pop();
        }
        return (truncated.join('') + '...');
      }
    }
  }

  return {
    listProperties: listProperties,
    strcmp: strcmp,
    uniqueStrings: uniqueStrings,
    splitAtLastPeriod: splitAtLastPeriod,
    removeHTML: removeHTML,
    trim: trim,
    truncateAtWordBoundary: truncateAtWordBoundary
  };
}());
