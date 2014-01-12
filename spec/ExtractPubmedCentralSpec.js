describe('EIGENFACTORIZER.extract_pubmed_central', function () {
  var extract = EIGENFACTORIZER.extract_pubmed_central;

  describe('#getArticleTitle', function () {
    it('should extract PMC article title', function () {
      loadFixtures('../../../../fixtures/2013/pmc_article.html');
      expect(extract.getArticleTitle()).toEqual(
	'High Peritoneal KT/V and Peritonitis Rates Are Associated ' +
	  'with Peritoneal Calcification');
    });
  });

  describe('#getArticleDescription', function () {
    it('should generate PMC from journal, publication date, and authors', function () {
      loadFixtures('../../../../fixtures/2013/pmc_article.html');
      expect(extract.getArticleDescription()).toEqual(
	'PLoS ONE; 2013; Jenq-Wen Huang, Yu-Chung Lien, Chung-Yi Yang, ' + 
	  'Kao-Lang Liu, Cheng-Chung Fang, Cho-Kai Wu, Jen-Kuang Lee, ' +
	  'Hon-Yen Wu, Chih-Kang Chiang, Hui-Teng Cheng, Chung-Jen Yen, Kuan-Yu Hung');
    });
  });

  describe('#getSearchResultJournals', function () {
    beforeEach(function () {
      loadFixtures('../../../../fixtures/2013/pmc_search_results.html');
    });

    it('should find all search results journals', function () {
      var journals = extract.getSearchResultJournals();
      expect(journals.length).toEqual(20);
      expect(journals).toEqual([
	'Am J Clin Nutr',
	'J Agric Food Chem',
	'J Clin Endocrinol Metab',
	'Nephrol Dial Transplant',
	'Clin J Am Soc Nephrol',
	'Endocr Pract',
	'Nutr J', 'Am J Pathol',
	'BMC Musculoskelet Disord',
	'Clin Interv Aging',
	'Nephrol Dial Transplant',
	'J Clin Endocrinol Metab',
	'Semin Nephrol',
	'BMC Infect Dis',
	'J Am Soc Nephrol',
	'Atherosclerosis',
	'Gynecol Endocrinol',
	'Kidney Int',
	'Clin J Am Soc Nephrol',
	'J Cell Biochem' ]);
    });

    it('should add journal data to wrapper attributes', function () {
      var journals = extract.getSearchResultJournals(),
      item = $('.rprt .details .journal-title')[0],
      wrapper = $(item.parentNode);
      expect(wrapper).toHaveClass('eigenfactor-journal');
      expect(wrapper).toHaveAttr('journal', journals[0]);
      expect(wrapper).toHaveAttr('year', '2012');
    });
  });

  describe('#getPortletJournals', function () {
    it('should find all portlet journals in search results', function () {
      loadFixtures('../../../../fixtures/2013/pmc_article.html');
      journals = extract.getPortletJournals();
      expect(journals.length).toEqual(5);
      expect(journals).toEqual([
	'Nephrol Dial Transplant',
	'Adv Perit Dial',
	'Perit Dial Int',
	'Perit Dial Int',
	'Adv Ren Replace Ther' ]);
    });

    it('should add journal data to wrapper attributes', function () {
      loadFixtures('../../../../fixtures/2013/pmc_article.html');
      var journals = extract.getPortletJournals(),
      item = $('.portlet_content .source')[0],
      wrapper = $(item.parentNode);
      expect(wrapper).toHaveClass('eigenfactor-journal');
      expect(wrapper).toHaveAttr('journal', journals[0]);
      expect(wrapper).toHaveAttr('year', '2003');
    });

  });

  describe('#getArticleJournal', function () {
    beforeEach(function () {
      loadFixtures('../../../../fixtures/2013/pmc_article.html');
    });

    it('should find the journal in the article page', function () {
      var journals = extract.getArticleJournal();
      expect(journals.length).toEqual(1);
      expect(journals).toEqual(['PLoS One']);
    });

    it('should add journal data to wrapper attributes', function () {
      var journals = extract.getArticleJournal(),
      item = $($('.fm-citation .citation-abbreviation')[0].parentNode);
      expect(item).toHaveClass('eigenfactor-journal');
      expect(item).toHaveAttr('journal', journals[0]);
      expect(item).toHaveAttr('year', '2013');
    });
  });

});
