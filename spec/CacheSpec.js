describe('EIGENFACTORIZER.cache', function () {
    var cache = EIGENFACTORIZER.cache;

    describe('#getTimeout', function () {
        it('should return default values', function () {
            expect(cache.getTimeout().success).toEqual(1000 * 3600 * 24 * 7);
            expect(cache.getTimeout().failure).toEqual(1000 * 3600);
        });
    });

    describe('#setTimeout', function () {
        it('should set success and failure timeouts', function () {
            cache.setTimeout(1, 2);
            expect(cache.getTimeout().success).toEqual(1);
            expect(cache.getTimeout().failure).toEqual(2);
        });
    });

    describe('#saveToCache', function () {
        var title = 't';

        afterEach(function () {
            cache.clearCache();
        });

        it('should save object with timestamp to localStorage', function () {
            var key = cache.getStorageKey(title),
                ob = {a: 'aa', b: 'bb'},
                cached;

            cache.saveToCache(title, ob, 1000);
            cached = JSON.parse(localStorage.getItem(key));
            expect(cached.info).toEqual(ob);
            expect(cached.timestamp).toEqual(1000);
        });

        it('should cache undefined instead of null', function () {
            cache.saveToCache(title, null, 1000);
            expect(cache.getFromCache(title, 1001)).toEqual(undefined);
        });
    });

    describe('#getFromCache', function () {
        var ob = {a: 'aa', b: 'bb'},
            hit = 'hit',
            miss = 'miss';

        beforeEach(function () {
            cache.setTimeout(20, 10);
            cache.saveToCache(hit, ob, 1000);
            cache.saveToCache(miss, undefined, 1000);
        });

        afterEach(function () {
            cache.clearCache();
        });

        it('should retrieve fresh objects', function () {
            expect(cache.getFromCache(hit, 1001)).toEqual(ob);
            expect(cache.getFromCache(miss, 1001)).toEqual(undefined);
        });

        it('should not retrieve stale objects', function () {
            expect(cache.getFromCache(hit, 1030)).toEqual(null);
            expect(cache.getFromCache(miss, 1020)).toEqual(null);
        });

        it('should use failure timeout for misses', function () {
            expect(cache.getFromCache(miss, 1015)).toEqual(null);
            expect(cache.getFromCache(miss, 1005)).toEqual(undefined);
        });

    });

    describe('#clearCache', function () {
        beforeEach(function () {
            cache.clearCache();
        });

        afterEach(function () {
            cache.clearCache();
        });

        it('should remove cached objects', function () {
            var bar = {bar: 'bar'};
            cache.saveToCache('foo', bar);
            expect(cache.getFromCache('foo').bar).toEqual('bar');
            cache.clearCache();
            expect(cache.getFromCache('foo')).toEqual(null);
        });
    });

    describe('#countCachedItems', function () {
        beforeEach(function () {
            cache.clearCache();
        });

        afterEach(function () {
            cache.clearCache();
        });

        it('should remove cached objects', function () {
            var bar = {bar: 'bar'};
            expect(cache.countCachedItems()).toEqual(0);
            cache.saveToCache('foo', bar);
            expect(cache.countCachedItems()).toEqual(1);
        });
    });

});
