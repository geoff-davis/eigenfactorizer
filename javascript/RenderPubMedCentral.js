var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.render_pubmed_central = (function() {
  'use strict';

  var base = EIGENFACTORIZER.render_base,
    pubmed = EIGENFACTORIZER.render_pubmed,
    extract = EIGENFACTORIZER.extract_pubmed_central;

  function addPortletSearch() {
    var title = extract.getArticleTitle();
    if (!title) { return; }
    $(pubmed.toPortlet('Search',
                       base.getSearchLinks(title),
                       'portlet-search')).insertAfter(
                         $('.portlet-colors'));
    $('.portlet-search h3').tooltip(
      {title: 'Search the Web for this article'});
  }

  function addPortletShare() {
    var title = extract.getArticleTitle(),
      description,
      add_this;
    if (!title) { return; }
    description = extract.getArticleDescription();
    add_this = base.getAddThis(title, description);
    $(pubmed.toPortlet('Share',
                       add_this,
                       'portlet-share')).insertAfter(
                         $('.portlet-search'));
    $('.portlet-share h3').tooltip(
      {title: 'Share this article'});
  }

  function addPortletImpact() {
    var pmid,
      impact;
    if (!extract.getArticleTitle()) { return; }
    pmid = extract.getPubMedId();
    if (!pmid) { return; }
    impact = base.getImpact('pmcid', pmid);
    $(pubmed.toPortlet('Impact', impact, 'portlet-impact')).insertAfter(
      $('.portlet-share'));
    $('.portlet-impact h3').tooltip({title: 'Altmetrics from ImpactStory.it'});
  }

  function addPortlets() {
    pubmed.addPortletColors();
    addPortletSearch();
    addPortletShare();
    //addPortletImpact();
    pubmed.addPortletControls();
  }

  function render(remote_port) {
    addPortlets();
    base.colorJournals(remote_port, true, true);
  }

  function initialize() {
    pubmed.addCSS();
    $('body').addClass('eigenfactorizer-pubmedcentral');
  }

  return {
    initialize: initialize,
    render: render,
    isApplicable: extract.isApplicable,
    addPortlets: addPortlets,
    showPortlets: base.showPortlets,
    addToolTips: base.addToolTips
  };
}());
