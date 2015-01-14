'use strict';

angular.module('digApp.directives')
.directive('textFilter', function() {
    return {
        restrict: 'E',
        scope: {
            filterTitle: '@',
            filterField: '@',
            indexVM: '=indexvm',
            ejs: '=',
            filters: '=',
            aggResult: '=',
            loading: '&'
        },
        templateUrl: '/components/text-filter/text-filter.partial.html',
        link: function($scope) {
            $scope.textInput = {
                live: '',
                submitted: ''
            };

            $scope.submit = function() {
                $scope.textInput.submitted = $scope.textInput.live;
            };
        }
    };
});