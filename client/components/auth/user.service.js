'use strict';

angular.module('digApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      update: {
        method: 'POST',
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