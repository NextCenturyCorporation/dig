#dig
=========

DIG is a visual analysis tool based on a faceted search engine that enables rapid, interactive exploration of large data sets. Users refine their queries by entering search terms or selecting values from lists of aggregated attributes. DIG can be quickly configured for a new domain through simple configuration. 

Prerequisites:
- node.js
- grunt-cli installed globally (npm i -g grunt-cli)
- bower installed globally (npm i -g bower)
- MongoDB
- Elasticsearch

To use the yeoman angular-fullstack-generator to create new components for
the application, see the documentation at 
https://github.com/DaftMonk/generator-angular-fullstack which has useful generators to
create angular.js elements such as models, views, controllers, routes, 
directives, factories, etc.

When cloning this repository for the first time, run these two commands:

  `cd dig`
  
  `npm install`

  `bower install`

The workflow is:
  
  `grunt serve # starts the server and opens up the home page in your browser`

  `grunt test # run all of the tests`

  `grunt ... # see Gruntfile.js and documentation for grunt`

Once the server is started with grunt, when you modify the
application, the browser will refresh and show those changes.

To package the application for deployment:

  `grunt build # builds the application and prepares the dist/ directory`

  `bash ./package.sh # create a makeself archive that can be used to easily deploy dig` **(please note that this requires that makeself is installed on your system)**`

The `package.sh` script creates `dig_deploy.sh`.  Running `dig_deploy.sh` will extract the dig application and download docker-compose into a directory called `dig/`.  Inside the `dig/` directory is `run.sh` which can be used to run the dig application as a daemon.

All configuration for dig is done by modifying the docker-compose.yml file in the `dig/` directory.


Configuration:
- The application is currently configured to use an internal ElasticSearch service.  To change this configuration, modify **euiHost** variable in `client/app/app.js`.
- Depending on version (>= 1.4.x), it may be necessary to add add **http.cors.enabled : true** to elasticsearch.yml in the config directory of ElasticSearch
