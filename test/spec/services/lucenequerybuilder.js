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

    it('Groups a query tree with a single field and term', function () {
      var queryString = 'battery:horse';
      var query = LuceneQueryBuilder.createQuery(queryString);
      var groupedQueryTree = LuceneQueryBuilder.groupQueryTree(query.queryTree);

      expect(groupedQueryTree.operator).toBe('OR');
      expect(groupedQueryTree.type).toBe('root');

      expect(groupedQueryTree.nodes[0].type).toBe('field');
      expect(groupedQueryTree.nodes[0].operator).toBe('OR');

      expect(groupedQueryTree.nodes[0].nodes[0].field).toBe('battery');
      expect(groupedQueryTree.nodes[0].nodes[0].term).toBe('horse');
      expect(groupedQueryTree.nodes[0].nodes[0].fieldType).toBe('string');
    });

    it('Groups query tree fields with different operators', function () {
      var queryString = 'battery:horse AND staple:chair OR car:dinosaur';
      var query = LuceneQueryBuilder.createQuery(queryString);
      var groupedQueryTree = LuceneQueryBuilder.groupQueryTree(query.queryTree);

      expect(groupedQueryTree.operator).toBe('AND');
      expect(groupedQueryTree.type).toBe('root');

      expect(groupedQueryTree.nodes[0].type).toBe('field');

      expect(groupedQueryTree.nodes[0].nodes[0].field).toBe('battery');
      expect(groupedQueryTree.nodes[0].nodes[0].term).toBe('horse');
      expect(groupedQueryTree.nodes[0].nodes[0].fieldType).toBe('string');

      expect(groupedQueryTree.nodes[1].type).toBe('group');
      expect(groupedQueryTree.nodes[1].operator).toBe('OR');

      expect(groupedQueryTree.nodes[1].nodes[0].field).toBe('staple');
      expect(groupedQueryTree.nodes[1].nodes[0].term).toBe('chair');
      expect(groupedQueryTree.nodes[1].nodes[0].fieldType).toBe('string');

      expect(groupedQueryTree.nodes[1].nodes[1].field).toBe('car');
      expect(groupedQueryTree.nodes[1].nodes[1].term).toBe('dinosaur');
      expect(groupedQueryTree.nodes[1].nodes[1].fieldType).toBe('string');
    });

    it('Groups query tree fields with grouped terms', function () {
      var queryString = 'animal:(cat dog deer)';
      var query = LuceneQueryBuilder.createQuery(queryString);
      var groupedQueryTree = LuceneQueryBuilder.groupQueryTree(query.queryTree);

      expect(groupedQueryTree.operator).toBe('OR');
      expect(groupedQueryTree.type).toBe('root');

      expect(groupedQueryTree.nodes[0].type).toBe('group');
      expect(groupedQueryTree.nodes[0].operator).toBe('OR');

      expect(groupedQueryTree.nodes[0].nodes[0].field).toBe('animal');
      expect(groupedQueryTree.nodes[0].nodes[0].term).toBe('cat');
      expect(groupedQueryTree.nodes[0].nodes[0].fieldType).toBe('string');

      expect(groupedQueryTree.nodes[0].nodes[1].field).toBe('animal');
      expect(groupedQueryTree.nodes[0].nodes[1].term).toBe('dog');
      expect(groupedQueryTree.nodes[0].nodes[1].fieldType).toBe('string');

      expect(groupedQueryTree.nodes[0].nodes[2].field).toBe('animal');
      expect(groupedQueryTree.nodes[0].nodes[2].term).toBe('deer');
      expect(groupedQueryTree.nodes[0].nodes[2].fieldType).toBe('string');
    });
  });
});
