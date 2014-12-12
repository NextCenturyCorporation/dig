#dig
=========

This is the software project for Dig search application.

To use the yeoman angular-fullstack-generator to create new components for
the application, see the documentation at 
https://github.com/yeoman/generator-angular which has useful generators to
create angular.js elements such as models, views, controllers, routes, 
directives, factories, etc.

When cloning this repository for the first time, run these two commands:

  `cd dig`
  
  `npm install`

The workflow is:
  
  `grunt serve # starts the server and opens up the home page in your browser`

  `grunt test # run all of the tests`

  `grunt ... # see Gruntfile.js and documentation for grunt`

Once the server is started with grunt, when you modify the
application, the browser will refresh and show those changes.

Prerequisites:
- node.js
- mongodb
- grunt-cli installed globally (npm i -g grunt-cli)
- bower installed globally (npm i -g bower)

Configuration:
- The application is currently configured to use an internal ElasticSearch service.  To change this configuration, modify **euiHost** variable in `client/app/app.js`.
