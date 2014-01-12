var EIGENFACTORIZER = EIGENFACTORIZER || {};

EIGENFACTORIZER.extract_base = (function() {
  'use strict';

  var util = EIGENFACTORIZER.util,
    RE_YEAR = /(?:^|[^\d])(\d{4})(?:$|[^\d])/;

  function wrapItemWithLink(item) {
    var wrapper = document.createElement('a'),
      parent = item.parentNode,
      child = item.cloneNode(true),
      computedStyle = getComputedStyle(item),
      defaultStyles = {'position': 'relative',
                       'float': 'none',
                       'top': 'auto',
                       'bottom': 'auto',
                       'left': 'auto',
                       'right': 'auto'},
      property;
    wrapper.setAttribute('href', '#');
    // copy child styles to the wrapper to preserve PubMed's styles
    for (property in defaultStyles) {
      if (defaultStyles.hasOwnProperty(property)) {
        child.style[property] = defaultStyles[property];
        wrapper.style[property] =
          computedStyle.getPropertyValue(property);
      }
    }
    child.style['background-color'] = child.style.color = 'inherit';
    wrapper.appendChild(child);
    parent.replaceChild(wrapper, item);
    return wrapper;
  }

  function alreadyWrappedItem(item) { return item; }

  function processItems(selector, getTitle, getYear, wrapItem) {
    var items = document.querySelectorAll(selector),
      nItems = items.length,
      titles = [],
      i, item, wrapper, title, year;

    for (i = 0; i < nItems; i += 1) {
      item = items[i];
      // extract before wrapping b/c wrapping removes item from DOM
      try {
        title = getTitle(item);
        title = util.trim(util.removeHTML(title));
        titles.push(title);
      } catch (e1) {
        console.error('Error extracting journal title ' + i);
        console.error(e1.message);
        title = null;
      }
      try {
        year = getYear(item);
        year = parseInt(year, 10);
        // ignore truncated years, bad integers, etc
        if (isNaN(year) || year < 1000 || year > 2100) {
          year = null;
        }
      } catch (e2) {
        console.error('Error extracting journal year ' + i +
                      ' (' + title + ')');
        console.error(e2.message);
        year = null;
      }
      wrapper = wrapItem(item);
      wrapper.classList.add('eigenfactor-journal');
      wrapper.classList.add('unknown-eigenfactor');
      wrapper.classList.add('eigenfactor0');
      if (title) {
        wrapper.setAttribute('journal', title);
      }
      if (year) {
        wrapper.setAttribute('year', year);
      }
    }

    return titles;
  }

  return {
    RE_YEAR: RE_YEAR,
    wrapItemWithLink: wrapItemWithLink,
    alreadyWrappedItem: alreadyWrappedItem,
    processItems: processItems
  };
}());
