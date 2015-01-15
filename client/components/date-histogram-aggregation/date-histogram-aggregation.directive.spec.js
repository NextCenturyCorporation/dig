'use strict';

describe('Directive: dateHistogramAggregation', function () {

  // load the directive's module and view
  beforeEach(module('digApp'));
  beforeEach(module('components/date-histogram-aggregation/date-histogram-aggregation.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<date-histogram-aggregation></date-histogram-aggregation>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the dateHistogramAggregation directive');
  }));
});