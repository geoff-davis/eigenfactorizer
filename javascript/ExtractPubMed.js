var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.extract_pubmed = (function() {
  'use strict';

  var base = EIGENFACTORIZER.extract_base,
    util = EIGENFACTORIZER.util;

  function isApplicable() {
    return (window.location.hostname === 'www.ncbi.nlm.nih.gov' &&
            (window.location.pathname.substring(0, 7) === '/pubmed' ||
             window.location.pathname.substring(0, 13) === '/sites/entrez'));
  }

  function getArticleTitle() {
    var item = $('.rprt h1').first();
    if (!item || item.length === 0) { return; }
    item = item[0].innerHTML;
    if (!item) { return; }
    return util.removeHTML(item);
  }

  function getArticleDescription() {
    var items = [$('.rprt .cit'), $('.rprt .auths')];
    items = items.filter(function(item) { return item.length > 0; });
    items = items.map(function(item) {
      return util.removeHTML(item[0].innerHTML);
    });
    return (items.join('; ')).replace(/\s+/g, ' ');
  }

  function getSearchResultJournals() {
    // journal titles in search results
    return base.processItems(
      '.jrnl',
      function(item) {
        return item.innerHTML;
      },
      function(item) {
        var next = item.nextSibling,
          match;
        if (next) {
          match = base.RE_YEAR.exec(next.wholeText);
          return match && match[1];
        }
      },
      base.wrapItemWithLink);
  }

  function getPortletJournals() {
    // RHS portlet on search results pages and article pages
    return base.processItems(
      '.portlet_content .source',
      function(item) {
        return util.splitAtLastPeriod(item.innerHTML)[0].substring(1);
      },
      function(item) {
        var match = base.RE_YEAR.exec(
          util.splitAtLastPeriod(item.innerHTML)[1]);
        return match && match[1];
      },
      base.wrapItemWithLink);
  }

  function getArticleJournal() {
    return base.processItems(
      '.cit a',
      function(item) {
        return util.splitAtLastPeriod(item.innerHTML)[0];
      },
      function(item) {
        var next = item.nextSibling;
        if (next === null) {
          next = item.parentNode.nextSibling;
        }
        var match = base.RE_YEAR.exec(next.wholeText);
        return match && match[1];
      },
      base.alreadyWrappedItem);
  }

  function getPubMedId() {
    var pmid = $('.rprtid dd').first().text();
    if (!pmid || pmid.length === 0) { return; }
    return (pmid);
  }

  function getJournalTitles(extractMain, extractSidebar) {
    var titles = [];
    if (extractMain) {
      titles = getSearchResultJournals().concat(getArticleJournal());
    }
    if (extractSidebar) {
      titles = titles.concat(getPortletJournals());
    }
    return util.uniqueStrings(titles);
  }

  return {
    isApplicable: isApplicable,
    getArticleTitle: getArticleTitle,
    getArticleDescription: getArticleDescription,
    getSearchResultJournals: getSearchResultJournals,
    getPortletJournals: getPortletJournals,
    getArticleJournal: getArticleJournal,
    getJournalTitles: getJournalTitles,
    getPubMedId: getPubMedId
  };
}());
