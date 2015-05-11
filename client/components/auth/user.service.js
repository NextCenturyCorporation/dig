'use strict';

angular.module('digApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:urlAppend1/:urlAppend2', {
      id: '@_id'
    },
    {
      update: {
        method: 'PUT',
        params: {
          id:'me'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      notificationCount: {
        method: 'GET',
        params: {
          id:'reqHeader',
          urlAppend1: 'notifications',
          urlAppend2: 'count'
        }
      }
    });
  });