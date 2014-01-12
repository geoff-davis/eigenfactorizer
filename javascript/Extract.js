var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.extract = (function() {
  'use strict';
  var extractors = [EIGENFACTORIZER.extract_pubmed,
                    EIGENFACTORIZER.extract_pubmed_central],
    nExtractors = extractors.length,
    extractor = null;

  function getArticleTitle() {
    if (extractor) {
      return extractor.getArticleTitle();
    }
  }

  function getArticleDescription() {
    if (extractor) {
      return extractor.getArticleDescription();
    }
  }

  function getJournalTitles(includeMain, includeSidebar) {
    if (extractor) {
      return extractor.getJournalTitles(includeMain, includeSidebar);
    }
  }

  function initialize() {
    var i, e;
    for (i = 0; i < nExtractors; i += 1) {
      e = extractors[i];
      if (e.isApplicable()) {
        extractor = e;
        break;
      }
    }
  }

  initialize();

  return {
    getArticleTitle: getArticleTitle,
    getArticleDescription: getArticleDescription,
    getJournalTitles: getJournalTitles
  };
}());
