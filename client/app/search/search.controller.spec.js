'use strict';

describe('Controller: SearchCtrl', function () {

  // load the controller's module
  beforeEach(module('digApp'));

  var SearchCtrl, scope, state;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $state) {
    scope = $rootScope.$new();
    state = $state;
    state.current.name = 'search';
    spyOn(state, 'go');

    SearchCtrl = $controller('SearchCtrl', {
      $scope: scope,
      $state: state
    });
  }));

  it('should have imageChecked default to false', function () {
    expect(scope.imageChecked).toBe(false);
  });

  it('should have currentOpened default to 0', function () {
    expect(scope.currentOpened).toBe(0);
  });

  it('should have selectedImage default to 0', function () {
    expect(scope.selectedImage).toBe(0);
  });

  it('should have thumbClass default to \'col-md-0\'', function () {
    expect(scope.thumbClass).toBe('col-md-0');
  });

  it('should have descriptionClass default to \'col-md-12\'', function () {
    expect(scope.descriptionClass).toBe('col-md-12');
  });

  it('should not have scope.doc', function () {
    expect(scope.doc).toBe(undefined);
  });

  it('should default to list view', function () {
    expect(state.go).toHaveBeenCalledWith('search.list');
  });

  it('should change currentOpened to new index and update old opened value in array', function () {
    var array = [{obj: 1},{obj: 2}];
    var oldValue = scope.currentOpened;

    scope.closeOthers(1, array);

    expect(scope.currentOpened).toBe(1);
    expect(array[oldValue].isOpen).toBe(false);
  });

  it('should update imageChecked and css classes', function () {
    scope.imageCheckedClick();

    expect(scope.imageChecked).toBe(true);
    expect(scope.thumbClass).toBe('col-md-2');
    expect(scope.descriptionClass).toBe('col-md-10');
  });

  it('should update state to details view and add passed in doc to scope', function () {
    var testDoc = {name: 'TestDoc'};

    scope.viewDetails(testDoc);

    expect(scope.doc).not.toBeNull();
    expect(state.go).toHaveBeenCalledWith('search.list.details');
  }); 

  it('should update state from details to list view and null out scope.doc if scope.doc is set', function () {
    scope.doc = {name: 'TestDoc'};
    
    scope.viewList();

    expect(scope.doc).toBeNull();
    expect(state.go).toHaveBeenCalledWith('search.list');
  }); 

  it('should update selectedImage', function () {
    scope.selectImage(2);

    expect(scope.selectedImage).toBe(2);
  });  

  it('should replace special character', function () {
    var newString = scope.cleanString('€200');

    expect(newString).toBe('200');
  });

});
