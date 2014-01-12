describe('EIGENFACTORIZER.util', function () {
  var util = EIGENFACTORIZER.util;

  describe('#listProperties', function () {
    it('should list object properties', function () {
      var ob = { 'key_one': 'value_one',
                 'key_two': 'value_two' },
        props = util.listProperties(ob);
      expect(props.length).toEqual(2);
      expect(props[0]).toEqual('key_one = value_one');
    });

    it('should recurse into nested objects', function () {
      var nested_ob = { 'key_one':
                        { 'nested_key_one': 'nested_value_one',
                          'nested_key_two': 'nested_value_two' },
                        'key_two': 'value_two'},
        props = util.listProperties(nested_ob);
      expect(props.length).toEqual(2);
      expect(props[0]).toEqual(
        'key_one = nested_key_one = nested_value_one, ' +
          'nested_key_two = nested_value_two');
      expect(props[1]).toEqual('key_two = value_two');
    });
  });

  describe('#strcmp', function () {
    it('should know b follows a', function () {
      expect(util.strcmp('a', 'b')).toEqual(-1);
    });

    it('should know a precedes b', function () {
      expect(util.strcmp('b', 'a')).toEqual(1);
    });

    it('should know a == a', function () {
      expect(util.strcmp('a', 'a')).toEqual(0);
    });
  });

  describe('#uniqueStrings', function () {
    it('should remove duplicate strings', function () {
      expect(util.uniqueStrings(['a', 'b', 'b', 'a', 'b', 'a'])).toEqual(
        ['a', 'b']);
      expect(util.uniqueStrings(['a', 'a', 'b', 'b'])).toEqual(
        ['a', 'b']);
      expect(util.uniqueStrings(['b', 'b', 'a', 'a'])).toEqual(
        ['a', 'b']);
      expect(util.uniqueStrings(['a', 'a', 'a', 'a'])).toEqual(
        ['a']);
    });

    it('should handle empty lists', function () {
      expect(util.uniqueStrings([])).toEqual([]);
    });

    it('should handle unique lists', function () {
      expect(util.uniqueStrings(['e', 'd', 'c', 'b', 'a'])).toEqual(
        ['a', 'b', 'c', 'd', 'e']);
      expect(util.uniqueStrings(['c', 'b', 'a', 'e', 'd'])).toEqual(
        ['a', 'b', 'c', 'd', 'e']);
    });
  });

  describe('#splitAtLastPeriod', function () {
    it('should return null,null if string is null', function () {
      expect(util.splitAtLastPeriod(null)).toEqual([null, null]);
    });

    it('should split the string at the last period', function () {
      expect(util.splitAtLastPeriod('abc.def')).toEqual(['abc', 'def']);
    });

    it('should remove the last period', function () {
      expect(util.splitAtLastPeriod('abc.')).toEqual(['abc', '']);
      expect(util.splitAtLastPeriod('abc.def.')).toEqual(['abc.def', '']);
      expect(util.splitAtLastPeriod('.abc')).toEqual(['', 'abc']);
      expect(util.splitAtLastPeriod('.')).toEqual(['', '']);
    });

    it('should not delete initial periods', function () {
      expect(util.splitAtLastPeriod('abc.def.ghi.jkl')).toEqual(
        ['abc.def.ghi', 'jkl']);
    });

    it('should ignore trailing ellipses', function () {
      expect(util.splitAtLastPeriod('abc.def...')).toEqual(
        ['abc', 'def']);
    });
  });

  describe('#removeHTML', function () {
    it('should remove tags', function () {
      expect(util.removeHTML('abc <b>def</b> ghi')
            ).toEqual('abc def ghi');
    });
  });

  describe('#trim', function () {
    it('should remove left whitespace', function () {
      expect(util.trim('  abc')).toEqual('abc');
      expect(util.trim(' abc')).toEqual('abc');
    });

    it('should remove right whitespace', function () {
      expect(util.trim('abc ')).toEqual('abc');
      expect(util.trim('abc  ')).toEqual('abc');
    });

    it('should remove left and right whitespace', function () {
      expect(util.trim(' abc ')).toEqual('abc');
      expect(util.trim('  abc  ')).toEqual('abc');
      expect(util.trim('  ')).toEqual('');
    });

    it('should leave non-whitespace alone', function () {
      expect(util.trim('abc')).toEqual('abc');
    });

    it('should ignore null and undefined', function () {
      expect(util.trim(null)).toEqual(null);
      expect(util.trim(undefined)).toEqual(undefined);
    });
  });

  describe('#truncateAtWordBoundary', function() {
    it('should not alter a short string', function() {
      expect(util.truncateAtWordBoundary('The quick brown', 20)).toEqual('The quick brown');
    });

    it('should only truncate at a word boundary', function() {
      expect(util.truncateAtWordBoundary('The quick brown fox jumped', 12)).toEqual('The quick...');
    });

    it('should not include trailing whitespace', function() {
      expect(util.truncateAtWordBoundary('The quick', 7)).toEqual('The...');
    });
  });
});
