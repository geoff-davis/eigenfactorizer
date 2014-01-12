describe('EIGENFACTORIZER.extract_base', function () {
  var extract = EIGENFACTORIZER.extract_base;

  describe('#wrapItemWithLink', function () {
    it('should wrap article title with a link', function () {
      loadFixtures('../../../../fixtures/2013/search_results.html');
      var item = $('.jrnl')[0],
        itemClone = $.extend(true, {}, item),
        // clone computed style
        itemStyle = $.extend(true, {}, getComputedStyle(item)),
        wrapped = extract.wrapItemWithLink(item);
      expect(wrapped.tagName).toEqual('A');
      expect(wrapped.childNodes[0].tagName).toEqual(itemClone.tagName);
      expect(wrapped.childNodes[0].innerHTML).toEqual(
        itemClone.innerHTML);
      expect(wrapped.style.position).toEqual(itemStyle.position);
      expect(wrapped.childNodes[0].style.position).toEqual('relative');
      expect(wrapped.style.float).toEqual(itemStyle.float);
      expect(wrapped.childNodes[0].style.float).toEqual('none');
    });
  });

  describe('#alreadyWrappedItem', function () {
    it('should leave wrapped item alone', function () {
      loadFixtures('../../../../fixtures/2013/article.html');
      var item = $('.cit a')[0];
      expect(extract.alreadyWrappedItem(item)).toEqual(item);
    });
  });

});
