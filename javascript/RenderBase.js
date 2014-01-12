var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.render_base = (function() {
  'use strict';

  var extract = EIGENFACTORIZER.extract,
    logger = EIGENFACTORIZER.logger,
    INFLUENCE = ['Unknown influence',
                   'Lowest influence',
                   'Lower influence',
                   'Below average influence',
                   'Above average influence',
                   'Higher influence',
                   'Highest influence'],
    ADD_THIS = ['<a class="addthis_button_preferred_1"></a>',
                '<a class="addthis_button_preferred_2"></a>',
                '<a class="addthis_button_preferred_3"></a>',
                '<a class="addthis_button_preferred_4"></a>',
                '<a class="addthis_button_compact"></a>',
                '<a class="addthis_counter addthis_bubble_style"></a>'
               ].join(''),
    ADD_THIS_SCRIPTS = [
      '<script type="text/javascript">var addthis_config = ',
      '{"data_track_addressbar":true};</script>',
      '<script type="text/javascript" ',
      'src="https://s7.addthis.com/js/250/addthis_widget.js',
      '#pubid=ra-4fd8e5e715c4cd6e"></script>'].join('');

  function getClosestData(journalInfo, year) {
    var eigenfactors = journalInfo.eigenfactors, item, diff,
      minDiff = 999999, closestYear;

    if (!eigenfactors) { return; }
    year = parseInt(year, 10);
    if (isNaN(year)) { year = 9999; }

    for (item in eigenfactors) {
      if (eigenfactors.hasOwnProperty(item)) {
        diff = Math.abs(year - item);
        if (diff < minDiff) {
          minDiff = diff;
          closestYear = item;
        }
      }
    }
    return eigenfactors[closestYear];
  }

  function getSearchLinks(title) {
    var encoded_title = encodeURIComponent(title),
      google_url = 'http://scholar.google.com/scholar?q=' +
        encoded_title,
      ms_url = 'http://academic.research.microsoft.com/Search?query=' +
        encoded_title;
    return ['<ul>',
            '<li><a href="', google_url, '">Google Scholar</a></li>',
            '<li><a href="', ms_url, '">Microsoft Academic Search</a></li>',
            '</ul>'].join('');
  }

  function getAddThis(title, description) {
    var items = ['<div class="addthis_toolbox addthis_default_style"'];
    if (title) {
      items.push('addthis:title="TITLE"'.replace(
        'TITLE', title.replace('"', '&quot;')));
    }
    if (description) {
      items.push('addthis:description="DESCRIPTION"'.replace(
        'DESCRIPTION', description.replace('"', '&quot;')));
    }
    items.push('>');
    return items.join(' ') + ADD_THIS + '</div>' + ADD_THIS_SCRIPTS;
  }

  function getImpact(namespace, pmid) {
    return [
        '<script type="text/javascript" ',
          'src="http://impactstory.org/static/js/total-impact-item.js"></script>',
        '<span id="ti-id">', namespace, ':', pmid, '</span>',
        '<div id="ti-data"><!--ImpactStory puts data here--></div>'].join('');
  }

  function showPortletColors(show) {
    var portlet = $('.portlet-colors');
    if (show) {
      portlet.show();
    } else {
      portlet.hide();
    }
  }

  function showPortletSearch(show) {
    var portlet = $('.portlet-search');
    if (show) {
      portlet.show();
    } else {
      portlet.hide();
    }
  }

  function showPortletShare(show) {
    var portlet = $('.portlet-share');
    if (show) {
      portlet.show();
    } else {
      portlet.hide();
    }
  }

  function showPortletImpact(show) {
    var portlet = $('.portlet-impact');
    if (show) {
      portlet.show();
    } else {
      portlet.hide();
    }
  }

  function showPortlets(options) {
    showPortletColors(options.show_color_key);
    showPortletSearch(options.show_search);
    showPortletShare(options.show_share);
    showPortletImpact(options.show_impact);
  }

  function addToolTips() {
    $('a.eigenfactor-journal').each(function(n, item) {
      var title;
      item = $(item);
      title = item.attr('title');
      if (!title) {
        item.attr('title', item.attr('journal'));
      }
      item.tooltip();
    });
  }

  function colorJournals(remote_port, includeMain, includeSidebar) {
    // next extract titles from page
    var titles = extract.getJournalTitles(includeMain, includeSidebar);
    if (titles.length > 0) {
      logger.log('Extracted titles: ' + titles);
      // look up journal information - first call loads from cache
      remote_port.postMessage({receiver: 'journal-lookup-local',
                               titles: titles});
    }
  }

  return {
    getClosestData: getClosestData,
    getSearchLinks: getSearchLinks,
    getAddThis: getAddThis,
    getImpact: getImpact,
    showPortletColors: showPortletColors,
    showPortletSearch: showPortletSearch,
    showPortletShare: showPortletShare,
    showPortlets: showPortlets,
    addToolTips: addToolTips,
    colorJournals: colorJournals,
    INFLUENCE: INFLUENCE
  };

}());
