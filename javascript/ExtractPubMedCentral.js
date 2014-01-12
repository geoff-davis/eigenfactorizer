var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.extract_pubmed_central = (function() {
  'use strict';

  var base = EIGENFACTORIZER.extract_base,
    util = EIGENFACTORIZER.util;

  function isApplicable() {
    return (window.location.hostname === 'www.ncbi.nlm.nih.gov' &&
            window.location.pathname.substring(0, 4) === '/pmc');
  }

  function getArticleTitle() {
    var item = $('meta[name="citation_title"]').attr('content');
    if (!item || item.length === 0) { return; }
    return util.removeHTML(item);
  }

  function getArticleDescription() {
    var items = [$('meta[name="citation_journal_title"]').attr('content'),
                 $('meta[name="citation_date"]').attr('content'),
                 $('meta[name="citation_authors"]').attr('content')];
    items = items.filter(function(item) { return item.length > 0; });
    items = items.map(function(item) { return util.removeHTML(item); });
    return items.join('; ').replace(/\s+/g, ' ');
  }

  function getSearchResultJournals() {
    // journal titles in search results
    var items = document.querySelectorAll('.rprt .details'),
    nItems = items.length, i, s, item, wrapper, text, child;
    for (i = 0; i < nItems; i += 1) {
      item = items[i];
      try {
        child = item.childNodes[0];
        if (!child) { continue; }
        s = child.wholeText;
        if (!s) { continue; }
        s = s.split('.', 2);
        if (s.length === 2) {
          s[0] = s[0] + '.';
        }
        wrapper = document.createElement('span');
        wrapper.classList.add('journal-title');
        wrapper.innerHTML = s[0];
        text = document.createTextNode(s[1]);
        item.replaceChild(text, item.childNodes[0]);
        item.insertBefore(wrapper, text);
      } catch (e) {
        console.error('Error creating node ' + i);
        console.error(item);
        console.error(e.message);
      }
    }
    return base.processItems(
      '.rprt .details .journal-title',
      function(item) {
        var s = item.childNodes[0].wholeText;
        return s && util.trim(s.split('.', 1)[0]);
      },
      function(item) {
        var match = base.RE_YEAR.exec(item.parentNode.innerHTML);
        return match && match[1];
      },
      base.wrapItemWithLink);
  }

  function getPortletJournals() {
    // RHS portlet on search results pages and article pages
    return base.processItems(
      '.portlet_content .source',
      function(item) {
        return util.trim(util.splitAtLastPeriod(
          item.innerHTML.slice(1, -1))[0]);
      },
      function(item) {
        var match = base.RE_YEAR.exec(
          util.splitAtLastPeriod(item.innerHTML.slice(1, -1))[1]);
        return match && match[1];
      },
      base.wrapItemWithLink);
  }

  function getArticleJournal() {
    return base.processItems(
      '.fm-citation .citation-abbreviation',
      function(item) {
        return util.splitAtLastPeriod(item.innerHTML)[0];
      },
      function(item) {
        var match = base.RE_YEAR.exec(item.nextSibling.innerHTML);
        return match && match[1];
      },
      base.wrapItemWithLink);
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

  function getPubMedCentralId() {
    var pmcid = $('.navlink-box .accid').first().text();
    if (!pmcid || pmcid.length === 0) { return; }
    return (pmcid);
  }

  return {
    isApplicable: isApplicable,
    getArticleTitle: getArticleTitle,
    getArticleDescription: getArticleDescription,
    getSearchResultJournals: getSearchResultJournals,
    getPortletJournals: getPortletJournals,
    getArticleJournal: getArticleJournal,
    getJournalTitles: getJournalTitles,
    getPubMedId: getPubMedCentralId
  };
}());
