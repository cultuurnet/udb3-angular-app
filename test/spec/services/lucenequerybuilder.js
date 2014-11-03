'use strict';

describe('Service: LuceneQueryBuilder', function () {

  // load the service's module
  beforeEach(module('udbApp'));

  // instantiate service
  var LuceneQueryBuilder;
  beforeEach(inject(function (_LuceneQueryBuilder_) {
    LuceneQueryBuilder = _LuceneQueryBuilder_;
  }));

  describe('Service: LuceneQueryBuilder', function () {

    var createAndCompareUnparsedQuery = function (queryString) {
      var query = LuceneQueryBuilder.createQuery(queryString),
        unparsedQueryString = LuceneQueryBuilder.unparse(query);

      expect(unparsedQueryString).toEqual(queryString);
    };

    var exampleQueries = [
      'title:term',
      'foo:-"fizz buzz"',
      'title:"The Right Way" AND text:go'
    ];

    exampleQueries.forEach(function (exampleQuery) {
      it('Unparses example query: "' + exampleQuery + '"', function () {
        createAndCompareUnparsedQuery(exampleQuery);
      });
    });

    it('Unparses queries with range expressions',function () {
      createAndCompareUnparsedQuery('foo:[bar TO baz]');
      createAndCompareUnparsedQuery('foo:{bar TO baz}');
    });

    it('Unparses queries with modifiers', function () {
      createAndCompareUnparsedQuery('jakarta^4');
      createAndCompareUnparsedQuery('jakarta~0.1');
      createAndCompareUnparsedQuery('-jakarta');
      createAndCompareUnparsedQuery('+jakarta');
    });

    it('Uparses queries with operators', function () {
      createAndCompareUnparsedQuery('ride AND go');
      createAndCompareUnparsedQuery('foo OR bar');
      createAndCompareUnparsedQuery('"jakarta apache" NOT "Apache Lucene"');
    });

    it('Unparses queries with grouping', function () {
      createAndCompareUnparsedQuery('(jakarta OR apache) AND website');
    });

    it('Unparses queries with field grouping', function () {
      createAndCompareUnparsedQuery('title:(+return +"pink panther")');
    });
  });
});
