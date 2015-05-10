'use strict';

angular.module('digApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id', {
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
      }
    });
  });