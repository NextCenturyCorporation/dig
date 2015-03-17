'use strict';

describe('Directive: dateHistogramAggregation', function () {

  // load the directive's module and view
  beforeEach(module('digApp'));
  beforeEach(module('components/date-histogram-aggregation/date-histogram-aggregation.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();

    scope.indexVM = {
        filters: {
            ejsFilters: []
        },
        loading: true,
        page: 1,
        query: 'someValue',
        results: {
          aggregations: {
            date_hist_agg: {
              buckets: [{
                key_as_string: "1983-01-01T05:00:00.000Z",
                key: 410245200000,
                doc_count: 1
              }]
            }
          },
          hits: {
            hits: [{}],
            total: 1
          }
        }
    };
    scope.$digest();

    element = angular.element('<date-histogram-aggregation aggregation-name=\"date_hist_agg\" ' +
      'aggregation-key=\"dateCreated\" date-interval=\"month\" indexvm=\"indexVM\" ejs=\"ejs\" ' +
      'filters=\"filters\"></date-histogram-aggregation>');
    $compile(element)(scope);
    element.scope().$digest();
  }));

  // TODO: Enable when c3 is available.
  // it('should make hidden element visible', inject(function ($compile) {
  //   element = angular.element('<date-histogram-aggregation></date-histogram-aggregation>');
  //   element = $compile(element)(scope);
  //   scope.$apply();
  //   expect(element.text()).not.toBe('');
  // }));

});