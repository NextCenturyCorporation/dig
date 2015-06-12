'use strict';

describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('digApp'));

    // instantiate service
    var imageSearchService;
    var MainCtrl, scope, rootScope, state, location, modal, $httpBackend, modalOpts;
    var folders = [
      {
        _id: 0,
        username: "test",
        name: "ROOT",
        childIds: [1, 3]
      },{
        _id: 1,
        username: "test",
        name: "folder1",
        parentId: 0,
        childIds: [2],
        items: ["123", "45673", "2eqds"]
      },{
        _id: 2,
        username: "test",
        name: "folder2",
        parentId: 1,
        childIds: [],
        items: ["3frg"]
      },{
        _id: 3,
        username: "test",
        name: "folder3",
        parentId: 0,
        childIds: [4],
        items: ["123", "453", "2eqdaaas", "asd3d"]
      },{
        _id: 4,
        username: "test",
        name: "folder4",
        parentId: 3,
        childIds: [5, 6],
        items: ["123", "45673"]
      },{
        _id: 5,
        username: "test",
        name: "folder5",
        parentId: 4,
        childIds: [],
        items: ["12", "4573", "2es"]
      },{
        _id: 6,
        username: "test",
        name: "folder6",
        parentId: 4,
        childIds: [],
        items: []
      }
    ];

    var nestedFolders = [
      {
        _id: 1,
        name: "folder1",
        parentId: 0,
        children: [{
          _id: 2,
          name: "folder2",
          parentId: 1,
          children: []
        }]
      },{
        _id: 3,
        name: "folder3",
        parentId: 0,
        children: [{
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
        }]
      }
    ];

    // Initialize the controller and a mock scope
    beforeEach(function() {
        var simHost = 'http://localhost';
        var searchQuery;

        module(function($provide) {
            $provide.constant('simHost', simHost);
            $provide.constant('euiSearchIndex', 'dig');
            $provide.constant('euiConfigs', {
                facets: [],
                listFields: [],
                detailsFields: [],
                sort: {
                  folderOption: {
                      order: 'desc', title: 'Newest First'
                  },
                  options: [
                      {
                          order: 'rank',
                          title: 'Best Match'
                      },{
                          order: 'desc',
                          title: 'Newest First'
                      },{
                          order: 'asc',
                          title: 'Oldest First'
                      }
                  ]
                }
            });
        });

        inject(function ($controller, $rootScope, $state, _$httpBackend_, $location, $modal, $q, _imageSearchService_) {

            rootScope = $rootScope;
            scope = $rootScope.$new();
            location = $location;
            state = $state;
            state.current.name = 'main';
            spyOn(state, 'go');
            modal = $modal;
            spyOn($modal, 'open').andCallFake(function(options) {
                modalOpts = options;
                return {
                  result: $q.defer().promise
                };
              }
            );

            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('api/folders/').respond(200, folders);
            $httpBackend.when('GET', new RegExp('app/search/main.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/folder.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/search.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/results.partial.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/list/list.partial.html'))
                .respond(200, 'some text');
            $httpBackend.when('GET', new RegExp('app/search/details/details.html'))
                .respond(200, 'some text');
            imageSearchService = _imageSearchService_;

            MainCtrl = $controller('MainCtrl', {
                $scope: scope,
                $state: state,
                $modal: modal
            });

            scope.indexVM = {
                filters: {
                    ejsFilters: []
                },
                loading: true,
                page: 1,
                query: 'someValue'
            };

            scope.$digest();
        });

    });

    it('should initialize variables based on state params', function() {
        inject(function($controller) {
            state.current.name = 'main.search.results.list';
            state.params = {
                query: { 
                    _id: 1,
                    name: 'Query #1',
                    digState: {
                        searchTerms: 'bob smith',
                        filters: {
                            aggFilters: {
                                city_agg: {
                                  'LittleRock': true,
                                  'FortSmith': true
                                }
                            },
                            textFilters: {
                                phonenumber: {
                                  live: '',
                                  submitted: ''
                                }
                            },
                            dateFilters: {
                                dateCreated: {
                                  beginDate: null,
                                  endDate: null
                                }
                            }
                        },
                        selectedSort: {
                            title:'Best Match',
                            order:'rank'
                        },  
                        includeMissing: {
                            allIncludeMissing : false, 
                            aggregations : { 
                                city_agg : { 
                                    active : true 
                                } 
                            } 
                        }
                    }, 
                    elasticUIState: {
                        queryState: {
                            query_string: {
                                fields:['_all'],
                                query:'bob smith'
                            }
                        },
                        filterState: {
                            bool: {
                                should: [
                                    {
                                        terms: {
                                            'hasFeatureCollection\\uff0eplace_postalAddress_feature\\uff0efeatureObject\\uff0eaddressLocality':['LittleRock']
                                        }
                                    },
                                    {
                                        terms: {
                                            'hasFeatureCollection\\uff0eplace_postalAddress_feature\\uff0efeatureObject\\uff0eaddressLocality':['FortSmith']
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    username: 'test',
                    frequency: 'daily',
                    createDate: '2015-04-01T20:13:11.093Z',
                    lastRunDate: '2015-04-01T20:13:11.093Z'
                }    
            };

            MainCtrl = $controller('MainCtrl', {
                $scope: scope,
                $state: state
            });

            rootScope.$broadcast('$locationChangeSuccess', '/list', '/queries');

        });

        expect(scope.queryString.live).toBe(state.params.query.digState.searchTerms);
        expect(scope.queryString.submitted).toBe(state.params.query.digState.searchTerms);
        expect(scope.filterStates).toEqual(state.params.query.digState.filters);
        expect(scope.includeMissing).toEqual(state.params.query.digState.includeMissing);

    });

    it('should not initialize query state if query params blank', function() {
        inject(function($controller) {
            state.params = {query: {digState:{filters: {}}}};

            MainCtrl = $controller('MainCtrl', {
                $scope: scope,
                $state: state
            });

            rootScope.$broadcast('$locationChangeSuccess', '/list', '/queries');

        });
    
        expect(scope.queryString.live).toBe('');
        expect(scope.queryString.submitted).toBe('');
        expect(scope.filterStates).toEqual({aggFilters: {}, textFilters: {}, dateFilters: {}});
        expect(scope.includeMissing).toEqual({aggregations: {}, allIncludeMissing: false});
        expect(scope.selectedSort).toEqual({});

    });

    it('should initialize showresults to false', function () {
        expect(scope.showresults).toBe(false);
    });

    it('should initialize loading to false', function () {
        expect(scope.loading).toBe(false);
    });

    it('should initialize queryString values to empty strings', function () {
        expect(scope.queryString.live).toBe('');
        expect(scope.queryString.submitted).toBe('');
    });

    it('should set loading to false', function () {
        scope.indexVM.loading = false;
        scope.$digest();
        expect(scope.loading).toBe(false);
    });

    it('should set showresults to true', function () {
        scope.queryString.submitted = 'test';
        scope.indexVM.loading = false;
        scope.$digest();
        expect(scope.showresults).toBe(true);
    });

    it('should default to list view', function () {
        expect(state.go).toHaveBeenCalledWith('main.search.results.list');
    });

    it('should set queryString.submitted to user input', function () {
        scope.queryString.live = 'test';
        scope.submit();
        expect(scope.queryString.submitted).toBe('test');
    });

    it('should toggle the enable state of the active search appropriately', function() {
        // Since this merely intiates a search which won't complete, the initial enable
        // state should be false.  
        imageSearchService.imageSearch('https://some.server/test.jpg');
        expect(imageSearchService.isImageSearchEnabled('https://some.server/test.jpg')).toBe(false);

        scope.toggleImageSearchEnabled('https://some.server/test.jpg', true);
        expect(imageSearchService.isImageSearchEnabled('https://some.server/test.jpg')).toBe(true);

        scope.toggleImageSearchEnabled('https://some.server/test.jpg', false);
        expect(imageSearchService.isImageSearchEnabled('https://some.server/test.jpg')).toBe(false);
    });

    it('should initialize folders', function () {
      $httpBackend.flush();
      
      expect(scope.nestedFolders).toEqual(nestedFolders);
      expect(scope.selectedFolder).toEqual({});
      expect(scope.validMoveFolders).toEqual([]);
      expect(scope.rootFolder).toEqual(folders[0]);
      expect(scope.selectedItems).toEqual({"#filter": []});
      expect(scope.selectedChildFolders).toEqual({"#filter": []});
      expect(scope.selectedItemsKey).toEqual("#filter");
      expect(scope.selectedFolderSort).toEqual({});
      expect(scope.selectedFolderSortOptions.sort.options).toEqual([
          {
              order: 'desc',
              title: 'Newest First'
          },{
              order: 'asc',
              title: 'Oldest First'
          }
      ]);
      expect(scope.folders).toEqual([
        {
          _id: 1,
          username: "test",
          name: "folder1",
          parentId: 0,
          childIds: [2],
          items: ["123", "45673", "2eqds"]
        },{
          _id: 2,
          username: "test",
          name: "folder2",
          parentId: 1,
          childIds: [],
          items: ["3frg"]
        },{
          _id: 3,
          username: "test",
          name: "folder3",
          parentId: 0,
          childIds: [4],
          items: ["123", "453", "2eqdaaas", "asd3d"]
        },{
          _id: 4,
          username: "test",
          name: "folder4",
          parentId: 3,
          childIds: [5, 6],
          items: ["123", "45673"]
        },{
          _id: 5,
          username: "test",
          name: "folder5",
          parentId: 4,
          childIds: [],
          items: ["12", "4573", "2es"]
        },{
          _id: 6,
          username: "test",
          name: "folder6",
          parentId: 4,
          childIds: [],
          items: []
        }
      ]);
    });

    it('should initialize activeTab to filter tab', function () {
        expect(scope.activeTab).toBe('#filter');
    });

    it('should change activeTab on tab select', function () {
        scope.changeTab('#folders');
        expect(scope.activeTab).toBe('#folders');
        expect(scope.selectedFolder).toEqual({});
        expect(scope.validMoveFolders).toEqual([]);
        scope.changeTab('#filter');
        expect(scope.activeTab).toBe('#filter');
        expect(scope.selectedFolder).toEqual({});
        expect(scope.validMoveFolders).toEqual([]);
        expect(scope.selectedFolderSort).toEqual({});
        expect(scope.selectedItemsKey).toEqual('#filter');
        expect(state.go).toHaveBeenCalledWith('main.search.results.list');
    });

    it('should deselect folder on tab change', function () {
        scope.selectedFolder = nestedFolders[1].children[0];

        scope.changeTab('#filter');
        expect(scope.activeTab).toBe('#filter');
        expect(scope.selectedFolder).toEqual({});
        expect(scope.validMoveFolders).toEqual([]);
        expect(scope.selectedItemsKey).toEqual('#filter');
        expect(state.go).toHaveBeenCalledWith('main.search.results.list');
        scope.changeTab('#folders');
        expect(scope.activeTab).toBe('#folders');
        expect(scope.selectedFolder).toEqual({});
        expect(scope.validMoveFolders).toEqual([]);
        expect(scope.selectedItemsKey).toEqual('#filter');
    });

    it('should select folder and have valid moveTo folders', function () {
        var validFolders1 = [
          {
            name: "ROOT",
            _id: 0 
          },{
            name: "folder1",
            _id: 1,
            parentId: 0
          },{
            name: "folder2",
            _id: 2,
            parentId: 1
          },{
            name: "folder3",
            _id: 3,
            parentId: 0
          }
        ];

        var validFolders2 = [
          {
            name: "ROOT",
            _id: 0
          },{
            name: "folder1",
            _id: 1,
            parentId: 0
          },{
            name: "folder2",
            _id: 2,
            parentId: 1
          }
        ];

        $httpBackend.flush();

        // Select a folder initially
        expect(scope.selectedItems).toEqual({"#filter": []});
        expect(scope.selectedChildFolders).toEqual({"#filter": []});
        scope.select(nestedFolders[1].children[0]);
        expect(state.go).toHaveBeenCalledWith('main.folder.results.list');
        expect(scope.activeTab).toBe('#folders');
        expect(scope.validMoveFolders).toEqual(validFolders1);
        expect(scope.selectedFolder).toEqual(nestedFolders[1].children[0]);
        expect(scope.selectedItems).toEqual({
          "#filter": [],
          4: []
        });
        expect(scope.selectedChildFolders).toEqual({
          "#filter": [],
          4: []
        });
        expect(scope.selectedItemsKey).toEqual(4);
        expect(scope.selectedFolderSort).toEqual({order: 'desc', title: 'Newest First'});

        // Select a different folder to test folder change
        scope.select(nestedFolders[1]);
        expect(state.go).toHaveBeenCalledWith('main.folder.results.list');
        expect(scope.activeTab).toBe('#folders');
        expect(scope.validMoveFolders).toEqual(validFolders2);
        expect(scope.selectedFolder).toEqual(nestedFolders[1]);
        expect(scope.selectedItems).toEqual({
          "#filter": [],
          4: [],
          3: []
        });
        expect(scope.selectedChildFolders).toEqual({
          "#filter": [],
          4: [],
          3: []
        });
        expect(scope.selectedItemsKey).toEqual(3);
    });

    /*it('should deselect folder and have valid moveTo folders', function () {
        $httpBackend.flush();

        scope.selectedFolder = nestedFolders[1].children[0];
        scope.selectedItems[4] = [];
        scope.selectedChildFolders[4] = [];
        scope.selectedItemsKey = 4;

        scope.select(nestedFolders[1].children[0]);
        expect(state.go).toHaveBeenCalledWith('main.folder.results.list');
        expect(scope.activeTab).toBe('#folders');
        expect(scope.validMoveFolders).toEqual([]);
        expect(scope.selectedFolder).toEqual({});
        expect(scope.selectedItems).toEqual({"#filter": []});
        expect(scope.selectedChildFolders).toEqual({"#filter": []});
        expect(scope.selectedItemsKey).toEqual(4);
    });*/

    it('should change active tab on /folder load', function () {
      spyOn(location, 'path').andReturn('/folder');

      expect(scope.isActive()).toBe(true);
      expect(scope.activeTab).toBe("#folders");
    });

    it('should change active tab on /gallery load', function () {
      spyOn(location, 'path').andReturn('/search');

      expect(scope.isActive()).toBe(true);
      expect(scope.activeTab).toBe("#filter");
    });

    it('should change active tab on /list load', function () {
      spyOn(location, 'path').andReturn('/search');

      expect(scope.isActive()).toBe(true);
      expect(scope.activeTab).toBe("#filter");
    });

    it('should not change active tab on unknown url load', function () {
      spyOn(location, 'path').andReturn('/fake');

      expect(scope.isActive()).toBe(false);
    });

    it('should open edit modal', function () {
      var modalParameters = {
        templateUrl: 'components/folder/edit-modal.html',
        controller: 'EditModalCtrl',
        resolve: { folder: jasmine.any(Function) },
        size: 'sm'
      };

      scope.selectedFolder = nestedFolders[0];

      scope.editFolder();
      $httpBackend.flush();
      expect(modal.open).toHaveBeenCalledWith(modalParameters);
      expect(modalOpts.resolve.folder()).toEqual(nestedFolders[0]);
    });

    it('should open delete folders modal', function () {
      var modalParameters = {
        templateUrl: 'components/folder/delete-folder-modal.html',
        controller: 'EditModalCtrl',
        resolve: { folder: jasmine.any(Function) },
        size: 'sm'
      };

      scope.selectedFolder = nestedFolders[0];

      scope.deleteFolder();
      $httpBackend.flush();
      expect(modal.open).toHaveBeenCalledWith(modalParameters);
      expect(modalOpts.resolve.folder()).toEqual(nestedFolders[0]);
    });

    it('should open create modal for moving folders', function () {
      var modalParameters = {
        templateUrl: 'components/folder/create-modal.html',
        controller: 'CreateModalCtrl',
        resolve: { folders: jasmine.any(Function), currentFolder: jasmine.any(Function), items: jasmine.any(Function), childIds: jasmine.any(Function) },
        size: 'sm'
      };

      scope.selectedFolder = nestedFolders[0];
      scope.selectedItems[nestedFolders[0]._id] = ["12ed32q", "1312e", "13es"];

      scope.createFolder(false);
      $httpBackend.flush();
      expect(modal.open).toHaveBeenCalledWith(modalParameters);
      expect(modalOpts.resolve.currentFolder()).toEqual(nestedFolders[0]);
      expect(modalOpts.resolve.items()).toEqual([]);
      expect(modalOpts.resolve.childIds()).toEqual([]);
      expect(modalOpts.resolve.folders()).toEqual([
          {
            name: "ROOT",
            _id: 0
          },{
            name: "folder3",
            parentId: 0,
            _id: 3
          },{
            name: "folder4",
            parentId: 3,
            _id: 4
          },{
            name: "folder5",
            parentId: 4,
            _id: 5
          },{
            name: "folder6",
            parentId: 4,
            _id: 6
          }
        ]);
    });

    it('should open create modal for moving items and subfolders', function () {
      $httpBackend.flush();

      var modalParameters = {
        templateUrl: 'components/folder/create-modal.html',
        controller: 'CreateModalCtrl',
        resolve: { folders: jasmine.any(Function), currentFolder: jasmine.any(Function), items: jasmine.any(Function), childIds: jasmine.any(Function) },
        size: 'sm'
      };

      scope.selectedItemsKey = 1;
      scope.selectedChildFolders[scope.selectedItemsKey] = [2];
      scope.selectedFolder = nestedFolders[0];
      scope.selectedItems[scope.selectedItemsKey] = ["12ed32q", "1312e", "13es"];

      scope.createFolder(true);
      expect(modal.open).toHaveBeenCalledWith(modalParameters);
      expect(modalOpts.resolve.currentFolder()).toEqual({});
      expect(modalOpts.resolve.items()).toEqual(["12ed32q", "1312e", "13es"]);
      expect(modalOpts.resolve.childIds()).toEqual([2]);
      expect(modalOpts.resolve.folders()).toEqual([
          {
            name: "ROOT",
            _id: 0
          },{
            name: "folder3",
            _id: 3,
            parentId: 0
          },{
            name: "folder4",
            _id: 4,
            parentId: 3
          },{
            name: "folder5",
            _id: 5,
            parentId: 4
          },{
            name: "folder6",
            _id: 6,
            parentId: 4
          },{
            _id: 1,
            name: "folder1",
            parentId: 0
          }
        ]);
    });

    it('should open create modal for creating empty folder', function () {
      $httpBackend.flush();

      var modalParameters = {
        templateUrl: 'components/folder/create-modal.html',
        controller: 'CreateModalCtrl',
        resolve: { folders: jasmine.any(Function), currentFolder: jasmine.any(Function), items: jasmine.any(Function), childIds: jasmine.any(Function) },
        size: 'sm'
      };

      scope.selectedItemsKey = 1;
      scope.selectedChildFolders[scope.selectedItemsKey] = [2];
      scope.selectedFolder = nestedFolders[0];
      scope.selectedItems[scope.selectedItemsKey] = ["12ed32q", "1312e", "13es"];

      scope.createEmptyFolder();
      expect(modal.open).toHaveBeenCalledWith(modalParameters);
      expect(modalOpts.resolve.currentFolder()).toEqual({});
      expect(modalOpts.resolve.items()).toEqual([]);
      expect(modalOpts.resolve.childIds()).toEqual([]);
      expect(modalOpts.resolve.folders()).toEqual([
          {
            name: "ROOT",
            _id: 0
          },{
            _id: 1,
            name: "folder1",
            parentId: 0
          },{
            _id: 2,
            name: "folder2",
            parentId: 1
          },{
            name: "folder3",
            _id: 3,
            parentId: 0
          },{
            name: "folder4",
            _id: 4,
            parentId: 3
          },{
            name: "folder5",
            _id: 5,
            parentId: 4
          },{
            name: "folder6",
            _id: 6,
            parentId: 4
          }
        ]);
    });


    it('should update selected', function () {
      scope.selectedFolder = {
          _id: 1,
          name: "folder1OldName",
          parentId: 0,
          children: [{
            _id: 2,
            name: "folder2",
            parentId: 1,
            children: []
          }]
        };

      scope.validMoveFolders = [
          {
            name: "ROOT",
            _id: 0
          },{
            name: "folder3",
            _id: 3,
            parentId: 0
          },{
            name: "folder4",
            _id: 4,
            parentId: 3
          },{
            name: "folder5",
            _id: 5,
            parentId: 4
          },{
            name: "folder6",
            _id: 6,
            parentId: 4
          }
        ];

      $httpBackend.flush();

      // scope.selectedFolder should now have the name back to folder1, not folder1OldName
      expect(scope.selectedFolder).toEqual(nestedFolders[0]);

      // scope.folders should now have the name back to folder1, not folder1OldName
      expect(scope.folders).toEqual([
        {
          _id: 1,
          username: "test",
          name: "folder1",
          parentId: 0,
          childIds: [2],
          items: ["123", "45673", "2eqds"]
        },{
          _id: 2,
          username: "test",
          name: "folder2",
          parentId: 1,
          childIds: [],
          items: ["3frg"]
        },{
          _id: 3,
          username: "test",
          name: "folder3",
          parentId: 0,
          childIds: [4],
          items: ["123", "453", "2eqdaaas", "asd3d"]
        },{
          _id: 4,
          username: "test",
          name: "folder4",
          parentId: 3,
          childIds: [5, 6],
          items: ["123", "45673"]
        },{
          _id: 5,
          username: "test",
          name: "folder5",
          parentId: 4,
          childIds: [],
          items: ["12", "4573", "2es"]
        },{
          _id: 6,
          username: "test",
          name: "folder6",
          parentId: 4,
          childIds: [],
          items: []
        }
      ]);

      // should stay the same since only the name has changed
      expect(scope.validMoveFolders).toEqual([
          {
            name: "ROOT",
            _id: 0
          },{
            name: "folder3",
            _id: 3,
            parentId: 0
          },{
            name: "folder4",
            _id: 4,
            parentId: 3
          },{
            name: "folder5",
            _id: 5,
            parentId: 4
          },{
            name: "folder6",
            _id: 6,
            parentId: 4
          }
        ]);
    });

    it('should deselect selected', function () {
      scope.selectedFolder = {
          _id: 7,
          name: "folder7",
          parentId: 0,
          children: []
        };

      scope.validMoveFolders = [
          {
            name: "ROOT",
            _id: 0
          },{
            name: "folder1",
            _id: 1,
            parentId: 0
          },{
            name: "folder2",
            _id: 2,
            parentId: 1
          },{
            name: "folder3",
            _id: 3,
            parentId: 0
          },{
            name: "folder4",
            _id: 4,
            parentId: 3
          },{
            name: "folder5",
            _id: 5,
            parentId: 4
          },{
            name: "folder6",
            _id: 6,
            parentId: 4
          }
        ];

      $httpBackend.flush();

      // scope.selectedFolder should now be nothing due to scope.selectedFolder not existing in http get return value
      expect(scope.selectedFolder).toEqual({});

      // should be nothing since folder selected was deleted
      expect(scope.validMoveFolders).toEqual([]);
    });

    it('should update nestedFolders', function () {
      scope.nestedFolders = [
        {
          _id: 3,
          name: "folder3",
          parentId: 0,
          children: [{
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
          },{
            _id: 1,
            name: "folder1",
            parentId: 3,
            children: [{
              _id: 2,
              name: "folder2",
              parentId: 1,
              children: []
            }]
          }]
        }
      ];

      scope.selectedFolder = {
          _id: 1,
          name: "folder1",
          parentId: 3,
          children: [{
            _id: 2,
            name: "folder2",
            parentId: 1,
            children: []
          }]
        };

      scope.validMoveFolders = [
          {
            name: "ROOT",
            _id: 0
          },{
            name: "folder3",
            _id: 3,
            parentId: 0
          },{
            name: "folder4",
            _id: 4,
            parentId: 3
          },{
            name: "folder5",
            _id: 5,
            parentId: 4
          },{
            name: "folder6",
            _id: 6,
            parentId: 4
          }
        ];

      $httpBackend.flush();

      // scope.selectedFolder should now have the parentId back to 0, not 3
      expect(scope.selectedFolder).toEqual(nestedFolders[0]);

      //scope.nestedFolders should now have folder1 a child of root, not folder3
      expect(scope.nestedFolders).toEqual(nestedFolders);

      // Should be back to its original state
      expect(scope.folders).toEqual([
        {
          _id: 1,
          username: "test",
          name: "folder1",
          parentId: 0,
          childIds: [2],
          items: ["123", "45673", "2eqds"]
        },{
          _id: 2,
          username: "test",
          name: "folder2",
          parentId: 1,
          childIds: [],
          items: ["3frg"]
        },{
          _id: 3,
          username: "test",
          name: "folder3",
          parentId: 0,
          childIds: [4],
          items: ["123", "453", "2eqdaaas", "asd3d"]
        },{
          _id: 4,
          username: "test",
          name: "folder4",
          parentId: 3,
          childIds: [5, 6],
          items: ["123", "45673"]
        },{
          _id: 5,
          username: "test",
          name: "folder5",
          parentId: 4,
          childIds: [],
          items: ["12", "4573", "2es"]
        },{
          _id: 6,
          username: "test",
          name: "folder6",
          parentId: 4,
          childIds: [],
          items: []
        }
      ]);

      expect(scope.validMoveFolders).toEqual([
          {
            name: "ROOT",
            _id: 0
          },{
            name: "folder3",
            _id: 3,
            parentId: 0
          },{
            name: "folder4",
            _id: 4,
            parentId: 3
          },{
            name: "folder5",
            _id: 5,
            parentId: 4
          },{
            name: "folder6",
            _id: 6,
            parentId: 4
          }
        ]);
    });

    it('should update validMoveFolders', function () {
      scope.nestedFolders = [
        {
          _id: 3,
          name: "folder3",
          parentId: 0,
          children: [{
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
          },{
            _id: 2,
            name: "folder2",
            parentId: 3,
            children: []
          }]
        }
      ];

      scope.selectedFolder = {
          _id: 2,
          name: "folder2",
          parentId: 3,
          children: []
        };

      scope.validMoveFolders = [
          {
            name: "ROOT",
            _id: 0
          },{
            name: "folder3",
            _id: 3
          },{
            name: "folder4",
            _id: 4
          },{
            name: "folder5",
            _id: 5
          },{
            name: "folder6",
            _id: 6
          }
        ];

      $httpBackend.flush();

      expect(scope.selectedFolder).toEqual(nestedFolders[0].children[0]);

      //scope.nestedFolders should now have folder2 a child of new folder folder1, not folder3
      expect(scope.nestedFolders).toEqual(nestedFolders);

      // Should be back to its original state
      expect(scope.folders).toEqual([
        {
          _id: 1,
          username: "test",
          name: "folder1",
          parentId: 0,
          childIds: [2],
          items: ["123", "45673", "2eqds"]
        },{
          _id: 2,
          username: "test",
          name: "folder2",
          parentId: 1,
          childIds: [],
          items: ["3frg"]
        },{
          _id: 3,
          username: "test",
          name: "folder3",
          parentId: 0,
          childIds: [4],
          items: ["123", "453", "2eqdaaas", "asd3d"]
        },{
          _id: 4,
          username: "test",
          name: "folder4",
          parentId: 3,
          childIds: [5, 6],
          items: ["123", "45673"]
        },{
          _id: 5,
          username: "test",
          name: "folder5",
          parentId: 4,
          childIds: [],
          items: ["12", "4573", "2es"]
        },{
          _id: 6,
          username: "test",
          name: "folder6",
          parentId: 4,
          childIds: [],
          items: []
        }
      ]);

      //validMoveFolders should now include folder1
      expect(scope.validMoveFolders).toEqual([
          {
            name: "ROOT",
            _id: 0
          },{
            name: "folder1",
            _id: 1,
            parentId: 0
          },{
            name: "folder3",
            _id: 3,
            parentId: 0
          },{
            name: "folder4",
            _id: 4,
            parentId: 3
          },{
            name: "folder5",
            _id: 5,
            parentId: 4
          },{
            name: "folder6",
            _id: 6,
            parentId: 4
          }
        ]);
    });
 
    it('should clear selected items on submit', function () {
      scope.selectedItems["#filter"] = ["2e432e", "2ew"];
      scope.submit();
      expect(scope.selectedItems["#filter"]).toEqual([]);
    });

    it('should update scope.folders on folder request', function () {
      scope.folders = [
        {
          _id: 1,
          username: "test",
          name: "folder1",
          parentId: 0,
          childIds: [2],
          items: ["123", "45673", "2eqds"]
        },{
          _id: 2,
          username: "test",
          name: "folder2",
          parentId: 1,
          childIds: [],
          items: ["3frg"]
        },{
          _id: 3,
          username: "test",
          name: "folder3",
          parentId: 0,
          childIds: [4],
          items: ["123", "453", "2eqdaaas", "asd3d"]
        },{
          _id: 4,
          username: "test",
          name: "folder4",
          parentId: 3,
          childIds: [5, 6],
          items: ["123", "45673"]
        },{
          _id: 5,
          username: "test",
          name: "folder5",
          parentId: 4,
          childIds: [],
          items: ["12", "4573", "2es"]
        }
      ];
      
      $httpBackend.flush();
      expect(scope.folders).toEqual([
        {
          _id: 1,
          username: "test",
          name: "folder1",
          parentId: 0,
          childIds: [2],
          items: ["123", "45673", "2eqds"]
        },{
          _id: 2,
          username: "test",
          name: "folder2",
          parentId: 1,
          childIds: [],
          items: ["3frg"]
        },{
          _id: 3,
          username: "test",
          name: "folder3",
          parentId: 0,
          childIds: [4],
          items: ["123", "453", "2eqdaaas", "asd3d"]
        },{
          _id: 4,
          username: "test",
          name: "folder4",
          parentId: 3,
          childIds: [5, 6],
          items: ["123", "45673"]
        },{
          _id: 5,
          username: "test",
          name: "folder5",
          parentId: 4,
          childIds: [],
          items: ["12", "4573", "2es"]
        },{
          _id: 6,
          username: "test",
          name: "folder6",
          parentId: 4,
          childIds: [],
          items: []
        }
      ]);
    });

    it('should move folder', function() {
      $httpBackend.flush();
      $httpBackend.expectPUT('api/folders/' + nestedFolders[0]._id, {name: nestedFolders[0].name, parentId: nestedFolders[1]._id}).respond(200);
      $httpBackend.expectGET('api/folders/').respond(200, folders);

      scope.selectedFolder = nestedFolders[0];
      scope.moveFolder(nestedFolders[1]);
      $httpBackend.flush();
    });

    it('should open delete items modal', function () {
      var modalParameters = {
        templateUrl: 'components/folder/delete-items-modal.html',
        controller: 'DeleteItemsModalCtrl',
        resolve: { items: jasmine.any(Function), childIds: jasmine.any(Function), id: jasmine.any(Function) },
        size: 'sm'
      };

      scope.selectedItems[scope.selectedItemsKey] = ["12", "4573", "2es"];
      scope.selectedChildFolders[scope.selectedItemsKey] = [5];
      scope.selectedFolder = nestedFolders[1].children[0];

      scope.removeItems();
      expect(modal.open).toHaveBeenCalledWith(modalParameters);
      expect(modalOpts.resolve.items()).toEqual(["12", "4573", "2es"]);
      expect(modalOpts.resolve.childIds()).toEqual([5]);
      expect(modalOpts.resolve.id()).toEqual(nestedFolders[1].children[0]._id);
    });

});
