describe('EIGENFACTORIZER.lookup', function () {
  var cache = EIGENFACTORIZER.cache,
    lookup = EIGENFACTORIZER.lookup,
    journalInfo = {
      'shortname': 'BMC Cancer',
      'longname': 'BMC cancer',
      'url': 'http:\/\/www.eigenfactor.org\/rankings.php?' +
        'search=1471-2407&searchby=issn&orderby=year',
      'eigenfactors': {'2002': {'colorcode': '3'},
                       '2003': {'colorcode': '4'}}
    },
    titles = ['BMC Cancer'];

  describe('#getRemoteEigenfactors', function () {
    beforeEach(function () {
      this.xhr = sinon.useFakeXMLHttpRequest();
      var requests = this.requests = [];
      this.xhr.onCreate = function (xhr) {
        requests.push(xhr);
      };
    });

    afterEach(function () {
      this.xhr.restore();
      cache.clearCache();
    });

    it('should look up the correct link', function () {
      lookup.getRemoteEigenfactors(titles);
      expect(this.requests[0].url).toEqual(lookup.getBaseUrl());
    });

    it('should send the correct body', function() {
      lookup.getRemoteEigenfactors(titles);
      expect(this.requests[0].requestBody).toEqual(
        'journals=' + encodeURIComponent(JSON.stringify(titles)));
    });

    it('should execute callback with parsed data', function () {
      lookup.getRemoteEigenfactors(titles, function (arg) {
        expect(arg[titles[0]]).toEqual(journalInfo);
      });
      this.requests[0].respond(200,
                               { 'Content-Type': 'application/json' },
                               JSON.stringify([journalInfo]));
    });

    it('should cache responses', function () {
      cache.clearCache();
      expect(cache.getFromCache(titles[0])).toEqual(null);
      lookup.getRemoteEigenfactors(titles);
      this.requests[0].respond(200,
                               { 'Content-Type': 'application/json' },
                               JSON.stringify([journalInfo]));
      expect(cache.getFromCache(titles[0])).toEqual(journalInfo);
    });
  });

  describe('#getLocalEigenfactors', function () {
    beforeEach(function () {
      cache.clearCache();
    });

    afterEach(function () {
      cache.clearCache();
    });

    it('should return cache-misses in unknown journals list', function () {
      expect(cache.getFromCache(titles[0])).toEqual(null);
      lookup.getLocalEigenfactors(titles, function(info, unknown) {
        expect(unknown).toEqual(titles);
      });
    });

    it('should return cache hits', function () {
      cache.saveToCache(titles[0], journalInfo);
      var unknown = lookup.getLocalEigenfactors(
        titles, function (info, unknown) {
          expect(unknown).toEqual([]);
          expect(info[titles[0]]).toEqual(journalInfo);
        });
    });
  });
});
