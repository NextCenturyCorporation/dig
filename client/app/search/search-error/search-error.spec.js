'use strict';

describe('Controller: SearchErrorCtrl', function() {
    beforeEach(module('digApp'));

    var SearchErrorCtrl;
    var scope;
    var state;
    var controller;
    beforeEach(function() {
        inject(function($controller, $rootScope, $state) {
            scope = $rootScope.$new();
            state = $state;
            controller = $controller;
            spyOn(state, 'go');

            scope.indexVM = {};

            SearchErrorCtrl = $controller('SearchErrorCtrl', {
                $scope: scope,
                $state: state
            });
        });
    });

    describe('on initialize', function() {
        describe('without indexVM error', function() {
            it('should redirect to search.result.list', function() {
                expect(state.go).toHaveBeenCalledWith('search.results.list');
            });
        });

        describe('with indexVM error', function() {
            beforeEach(function() {
                state.current.name = 'search.error';
                scope.indexVM = {
                    error: {
                        message: 'error message'
                    }
                };

                SearchErrorCtrl = controller('SearchErrorCtrl', {
                    $scope: scope,
                    $state: state
                });
            });

            it('should define $scope.error as null', function() {
                expect(scope.error).toBeNull();
            });
        });
    });

    describe('function calls', function() {
        describe('with indexVM error', function() {
            beforeEach(function() {
                state.current.name = 'search.error';
                scope.indexVM = {
                    error: {
                        message: 'error message'
                    }
                };

                SearchErrorCtrl = controller('SearchErrorCtrl', {
                    $scope: scope,
                    $state: state
                });
            });

            it('getTitle function should parse error and return default title', function() {
                expect(scope.error).toBeNull();
                var title = scope.getTitle();
                expect(scope.error).not.toBeNull();
                expect(scope.error.message).toBe('error message');
                expect(scope.error.title).toBe('Search Error');

                expect(title).toBe('Search Error');
            });

            it('getMessage function should parse error and return error message', function() {
                expect(scope.error).toBeNull();
                var message = scope.getErrorMessage();
                expect(scope.error).not.toBeNull();
                expect(scope.error.message).toBe('error message');
                expect(scope.error.title).toBe('Search Error');

                expect(message).toBe('error message');
            });

            describe('of Lucene search error type', function() {
                beforeEach(function() {
                    state.current.name = 'search.error';
                    scope.indexVM = {
                        error: {
                            message: 'Error Parse Failure',
                            body: {
                                status: 400
                            }
                        }
                    };

                    SearchErrorCtrl = controller('SearchErrorCtrl', {
                        $scope: scope,
                        $state: state
                    });
                });

                it('getMessage function should parse error and set correct title', function() {
                    expect(scope.error).toBeNull();
                    var title = scope.getTitle();
                    expect(scope.error).not.toBeNull();
                    expect(scope.error.message).toBe('Error Parse Failure');
                    expect(scope.error.title).toBe('Search Parse Error');

                    expect(title).toBe('Search Parse Error');
                });
            });

            describe('of elastic search connect error type', function() {
                beforeEach(function() {
                    state.current.name = 'search.error';
                    scope.indexVM = {
                        error: {
                            message: 'No Living connections',
                        }
                    };

                    SearchErrorCtrl = controller('SearchErrorCtrl', {
                        $scope: scope,
                        $state: state
                    });
                });

                it('getMessage function should parse error and set correct title', function() {
                    expect(scope.error).toBeNull();
                    var title = scope.getTitle();
                    expect(scope.error).not.toBeNull();
                    expect(scope.error.message).toBe('No Living connections');
                    expect(scope.error.title).toBe('Cannot Connect to Database');

                    expect(title).toBe('Cannot Connect to Database');
                });
            });
        });
    });
});