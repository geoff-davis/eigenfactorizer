describe('EIGENFACTORIZER.render', function () {
    var render = EIGENFACTORIZER.render,
        journalInfo = {
            'shortname': 'BMC Cancer',
            'longname': 'BMC cancer',
            'url': 'http:\/\/www.eigenfactor.org\/rankings.php?' +
                'search=1471-2407&searchby=issn&orderby=year',
            'eigenfactors': {'2002': {'colorcode': '3'},
                             '2003': {'colorcode': '4'},
                             '2004': {'colorcode': '5'}}
        },
        titles = ['BMC Cancer'];

    describe('#updatePage', function () {
        var allJournalInfo = {};
        allJournalInfo['BMC Cancer'] = journalInfo;

        it('should annotate elements', function () {
            jasmine.getFixtures().set($(
                '<a class="eigenfactor-journal unknown-eigenfactor eigenfactor0" journal="BMC Cancer" ' +
                    'year="2002" href="#">Text</a>'));
            render.updatePage(allJournalInfo);
            var item = $($('.eigenfactor-journal')[0]);
            expect(item).toHaveClass('eigenfactor3');
            expect(item.hasClass('eigenfactor0')).toBe(false);
            expect(item.hasClass('unknown-eigenfactor')).toBe(false);
            expect(item.attr('href')).toEqual(journalInfo['url']);
            expect(item.attr('title')).toEqual(journalInfo['longname'] + ' - ' + render.INFLUENCE[3]);
        });
    });
});
