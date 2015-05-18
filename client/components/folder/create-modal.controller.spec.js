'use strict';

describe('Controller: CreateModalCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    var CreateModalCtrl, scope, modalInstance, folders, currentFolder, user, $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(function() {

        inject(function ($controller, $rootScope, _$httpBackend_) {
            scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;

            modalInstance = {
              close: jasmine.createSpy('modalInstance.close')
            };
            user = {
              get: jasmine.createSpy('user.get').andReturn({username: 'test'})
            };

            folders = [
              {
                name: "ROOT",
                _id: 0
              },{
                name: "folder1",
                _id: 1
              },{
                name: "folder2",
                _id: 2
              },{
                name: "folder3",
                _id: 3
              }
            ];

            currentFolder = {
              _id: 4,
              name: "folder4",
              parentId: 3,
              children: [
                {
                  _id: 5,
                  name: "folder5",
                  parentId: 4,
                  children: []
                },{
                  _id: 6,
                  name: "folder6",
                  parentId: 4,
                  children: []
                }
              ]
            };

            CreateModalCtrl = $controller('CreateModalCtrl', {
                $scope: scope,
                $modalInstance: modalInstance,
                User: user,
                folders: folders,
                currentFolder: currentFolder
            });

        });
    });

    it('should initialize variables', function () {
        expect(user.get).toHaveBeenCalled();
        expect(scope.currentUser.username).toEqual('test');
        expect(scope.currentFolder).toEqual(currentFolder);
        expect(scope.folders).toEqual(folders);
        expect(scope.folderName).toEqual("");
    });

    it('should correctly enable/disable button', function () {
      expect(scope.isDisabled()).toBe(true);
      scope.folderName = "folder1";
      expect(scope.isDisabled()).toBe(true);
      scope.folderName = "";
      scope.parentFolder = folders[1];
      expect(scope.isDisabled()).toBe(true);
      scope.folderName = "folder1";
      scope.parentFolder = folders[1];
      expect(scope.isDisabled()).toBe(false);
    });

    it('should make call to close modal', function () {
        scope.cancel();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should move folder on create', function () {
        $httpBackend.expectPOST('api/folders', {name: 'folderNew', username: 'test', parentId: 1, childIds: [4]}).respond(201, {});
        scope.folderName = "folderNew";
        scope.parentFolder = {_id: 1};
        scope.create();
        $httpBackend.flush();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should create folder only on create', function () {
        $httpBackend.expectPOST('api/folders', {name: 'folderNew', username: 'test', parentId: 1, childIds: []}).respond(201, {});
        scope.currentFolder = {};
        scope.folderName = "folderNew";
        scope.parentFolder = {_id: 1};
        scope.create();
        $httpBackend.flush();
        expect(modalInstance.close).toHaveBeenCalled();
    });

});
