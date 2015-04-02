'use strict';

angular.module('digApp.directives')
.directive('scrollUtil', function($state, $window, $timeout) {
    return {
        scope: {
            resetScroll: '='
        },
        restrict: 'EA',
        link: function($scope) {
            $scope.scrollPosCache = {};

            $scope.$on('$stateChangeStart', function() {
                if($state.current.preserveScrollPos) {
                    $scope.scrollPosCache[$state.current.templateUrl] = [$window.pageXOffset, $window.pageYOffset];
                }
            });

            $scope.$on('$stateChangeSuccess', function() {
                $timeout(function() {
                    if($state.current.preserveScrollPos) {
                        var prevScrollPos = $scope.scrollPosCache[$state.current.templateUrl] || [0, 0];
                        $window.scrollTo(prevScrollPos[0], prevScrollPos[1]);
                    }
                }, 0);
            });

            $scope.$watch('resetScroll',
                function(newValue) {
                    if(newValue) {
                        for(var key in $scope.scrollPosCache) {
                            delete $scope.scrollPosCache[key];
                        }
                    }
                }
            );
        }
    };
});