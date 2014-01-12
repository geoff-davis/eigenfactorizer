describe('EIGENFACTORIZER.render_base', function () {
    var base = EIGENFACTORIZER.render_base,
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

    describe('#getClosestData', function () {
        it('should find the closest year', function () {
            expect(base.getClosestData(journalInfo, 2002)).toEqual(
                {'colorcode': '3'});
            expect(base.getClosestData(journalInfo, 2003)).toEqual(
                {'colorcode': '4'});
            expect(base.getClosestData(journalInfo, 2004)).toEqual(
                {'colorcode': '5'});
            expect(base.getClosestData(journalInfo, 2005)).toEqual(
                {'colorcode': '5'});
        });

        it('should find the earliest year if before range', function () {
            expect(base.getClosestData(journalInfo, 2001)).toEqual(
                {'colorcode': '3'});
            expect(base.getClosestData(journalInfo, 2000)).toEqual(
                {'colorcode': '3'});
        });

        it('should find the latest year if after range', function () {
            expect(base.getClosestData(journalInfo, 2005)).toEqual(
                {'colorcode': '5'});
            expect(base.getClosestData(journalInfo, 2006)).toEqual(
                {'colorcode': '5'});
        });

        it('should find the latest year if undefined', function () {
            expect(base.getClosestData(journalInfo, null)).toEqual(
                {'colorcode': '5'});
            expect(base.getClosestData(journalInfo, undefined)).toEqual(
                {'colorcode': '5'});
        });
    });

});
