var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.render_pubmed = (function() {
  'use strict';

  var base = EIGENFACTORIZER.render_base,
    extract = EIGENFACTORIZER.extract_pubmed,
    sidebarDone = false;

  function toPortlet(header, content, portlet_class) {
    var classes = ['portlet'];
    if (portlet_class) { classes.push(portlet_class); }
    return [
      '<div class="', classes.join(' '), '">',
        '<div class="portlet_head">',
          '<a class="portlet-control portlet-control-open"></a>',
          '<div class="portlet_title">',
            '<h3>',
              header,
            '</h3>',
          '</div>',
        '</div>',
        '<div class="portlet_content">',
          content,
        '</div>',
      '</div>'].join('');
  }

  function addPortletColors() {
    var key = [], i;
    key.push('<div class="portlet-actions">');
    // links to within the extension appear to now be disabled
    //key.push(['<a href="',
    //          chrome.extension.getURL('html/options.html'),
    //          '">Options</a>'].join(''));
    key.push(['<a href="http://www.eigenfactor.org/">',
              'Learn more</a>'].join(''));
    key.push('</div>');

    key.push('<table class="color-key"><tr>');
    for (i = 1; i < 7; i += 1) {
      key.push('<td href="#" class="eigenfactor' + i + '"></td>');
    }
    key.push('</tr></table>');
    key.push('<div class="higher-lower">');
    key.push('<div class="higher">Higher &rarr;</div>');
    key.push('<div class="lower">&larr; Lower</div>');
    key.push('</div>');
    key.push('</div>');
    $(toPortlet('Journal influence', key.join(''),
                'portlet-colors')).insertBefore(
                  $('.portlet').first()
    );
    $('.portlet-colors h3').tooltip(
      {title: 'Journals are colored according to ' +
       'their Eigenfactor Article Influence score',
       placement: 'right'});
  }

  function addPortletSearch() {
    var title = extract.getArticleTitle();
    if (!title) { return; }
    $(toPortlet('Search',
                base.getSearchLinks(title),
                'portlet-search')).insertAfter(
                  $('.portlet-colors'));
    $('.portlet-search h3').tooltip(
      {title: 'Search the Web for this article', placement: 'right'});
  }

  function addPortletShare() {
    var title = extract.getArticleTitle(),
      description,
      add_this;
    if (!title) { return; }
    description = extract.getArticleDescription();
    add_this = base.getAddThis(title, description);
    $(toPortlet('Share',
                add_this,
                'portlet-share')).insertAfter(
                  $('.portlet-search'));
    $('.portlet-share h3').tooltip({title: 'Share this article',
                                    placement: 'right'});
  }

  function addPortletImpact() {
    var pmid,
      impact;
    if (!extract.getArticleTitle()) { return; }
    pmid = extract.getPubMedId();
    if (!pmid) { return; }
    impact = base.getImpact('pmid', pmid);
    $(toPortlet('Impact', impact, 'portlet-impact')).insertAfter(
      $('.portlet-share'));
    $('.portlet-impact h3').tooltip(
      {title: 'Article metrics from ImpactStory.it',
       placement: 'right'});
  }

  function addPortletControls() {
    $('.portlet a.portlet-control').click(function(e) {
      var link = $(e.target),
        content = link.closest('.portlet').find('.portlet_content');
      if (link.hasClass('portlet-control-open')) {
        link.removeClass('portlet-control-open');
        link.addClass('portlet-control-closed');
        content.hide();
      } else {
        link.removeClass('portlet-control-closed');
        link.addClass('portlet-control-open');
        content.show();
      }
    });
  }

  function addPortlets() {
    $('.portlet').hide();
    addPortletColors();
    addPortletSearch();
    addPortletShare();
    //addPortletImpact();
    addPortletControls();
    $('.portlet').show();
  }

  function addCSS() {
    $('body').append(
      ['<style type="text/css">',
       '.portlet-colors h3, .portlet-search h3, .portlet-share h3, ',
         '.portlet-impact h3 { ',
       'background-image: ',
       'url("',
       chrome.extension.getURL('images/eigenfactor16.png'),
       '"); } ',
       'a.portlet-control-open { ',
       'background-image: ',
       'url("',
       chrome.extension.getURL('images/up.png'),
       '"); } ',
       'a.portlet-control-closed { ',
       'background-image: ',
       'url("',
       chrome.extension.getURL('images/down.png'),
       '"); } ',
       '}</style>'].join('')
    );
  }

  function isSidebarLoaded() {
    // PubMed defers rendering of the portlets in the right hand column.
    return ($('.supplemental .portlet').length > 0);
  }

  function onSidebarLoad(remote_port) {
    if (isSidebarLoaded() && !sidebarDone) {
      sidebarDone = true;
      addPortlets();
      base.colorJournals(remote_port, false, true);
    }
  }

  function render(remote_port) {
    if (isSidebarLoaded()) {
      onSidebarLoad(remote_port);
      base.colorJournals(remote_port, true, true);
    } else {
      var port = remote_port; // make port available in closure
      $('.supplemental').bind('DOMNodeInserted', function(e) {
        onSidebarLoad(port);
      });
      base.colorJournals(remote_port, true, false);
    }
  }

  function initialize() {
    addCSS();
    $('body').addClass('eigenfactorizer-pubmed');
  }

  return {
    initialize: initialize,
    render: render,
    isApplicable: extract.isApplicable,
    addPortlets: addPortlets,
    showPortlets: base.showPortlets,
    addToolTips: base.addToolTips,

    // PubMed methods shared by PubMedCentral
    addCSS: addCSS,
    addPortletColors: addPortletColors,
    addPortletControls: addPortletControls,
    toPortlet: toPortlet
  };
}());
