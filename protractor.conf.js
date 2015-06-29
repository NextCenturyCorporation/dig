 'use strict';

 // conf.js
 exports.config = {
     specs: ['e2e/**/*.spec.js'],
     baseUrl: 'http://localhost:' + (process.env.PORT || '9000'),
     directConnect: true,
     jasmineNodeOpts: 
     {
     	defaultTimeoutInterval: 500000
     }
 }
