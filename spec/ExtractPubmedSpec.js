describe('EIGENFACTORIZER.extract_pubmed', function () {
  var extract = EIGENFACTORIZER.extract_pubmed;

  describe('#getArticleTitle', function () {
    it('should extract article title', function () {
      loadFixtures('../../../../fixtures/2013/article.html');
      expect(extract.getArticleTitle()).toEqual(
	'High Peritoneal KT/V and Peritonitis Rates Are ' +
	  'Associated with Peritoneal Calcification.');
    });
  });

  describe('#getArticleDescription', function () {
    it('should generate from journal, publication date, and authors', function () {
      loadFixtures('../../../../fixtures/2013/article.html');
      expect(extract.getArticleDescription()).toEqual(
	'PLoS One. 2013 Aug 19;8(8):e71636. doi: 10.1371/journal.pone.0071636.; ' +
	  'Huang JW, Lien YC, Yang CY, Liu KL, Fang CC, Wu CK, Lee JK, Wu HY, Chiang CK, Cheng HT, Yen CJ, Hung KY.');
    });
  });

  describe('#getSearchResultJournals', function () {
    beforeEach(function () {
      loadFixtures('../../../../fixtures/2013/search_results.html');
    });

    it('should find all search results journals', function () {
      var journals = extract.getSearchResultJournals();
      expect(journals.length).toEqual(20);
      expect(journals).toEqual(['J Steroid Biochem Mol Biol',
				'Biomed Res Int',
				'Ann Stomatol (Roma)',
				'Wien Med Wochenschr',
				'Nurs Stand',
				'Metabolism',
				'Metabolism',
				'Rocz Panstw Zakl Hig',
				'Community Pract',
				'Int J Circumpolar Health',
				'Int J Endocrinol',
				'J Drugs Dermatol',
				'J Drugs Dermatol',
				'Medicina (Kaunas)',
				'N Engl J Med',
				'Biomed Res Int',
				'Int J Circumpolar Health',
				'Int J Endocrinol',
				'Cancer Epidemiol Biomarkers Prev',
				'Osteoporos Int' ]);
    });

    it('should add journal data to wrapper attributes', function () {
      var journals = extract.getSearchResultJournals(),
      item = $('.jrnl')[0],
        wrapper = $(item.parentNode);
      expect(wrapper).toHaveClass('eigenfactor-journal');
      expect(wrapper).toHaveAttr('journal', journals[0]);
      expect(wrapper).toHaveAttr('year', '2013');
    });
  });

  describe('#getPortletJournals', function () {
    it('should find all portlet journals in search results', function () {
      loadFixtures('../../../../fixtures/2013/search_results.html');
      journals = extract.getPortletJournals();
      expect(journals.length).toEqual(6);
      expect(journals).toEqual([
          'Evid Rep Technol Assess (Full Rep)',
	  'Horm Metab Res',
	  'Public Health Nutr',
	  'Int J Circumpolar Health',
	  'Int J Endocrinol',
	  'Biomed Res Int']);
    });

    it('should find all portlet journals in article page', function () {
      loadFixtures('../../../../fixtures/2013/article.html');
      journals = extract.getPortletJournals();
      expect(journals.length).toEqual(5);
      expect(journals).toEqual([
	  'Nephrol Dial Transplant',
	  'Adv Perit Dial',
	  'Perit Dial Int',
	  'Perit Dial Int',
	  'Adv Ren Replace Ther']);
    });

    it('should add journal data to wrapper attributes', function () {
      loadFixtures('../../../../fixtures/2013/article.html');
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
      loadFixtures('../../../../fixtures/2013/article.html');
    });

    it('should find the journal in the article page', function () {
      var journals = extract.getArticleJournal();
      expect(journals.length).toEqual(1);
      expect(journals).toEqual(['PLoS One']);
    });

    it('should add journal data to wrapper attributes', function () {
      var journals = extract.getArticleJournal(),
      item = $($('.cit a')[0]);
      expect(item).toHaveClass('eigenfactor-journal');
      expect(item).toHaveAttr('journal', journals[0]);
      expect(item).toHaveAttr('year', '2013');
    });
  });

});
