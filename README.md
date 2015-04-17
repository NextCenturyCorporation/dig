#DIG
=========

DIG is a visual analysis tool based on a faceted search engine that enables rapid, interactive exploration of large data sets. Users refine their queries by entering search terms or selecting values from lists of aggregated attributes. DIG can be quickly configured for a new domain through simple configuration. 

Prerequisites
-------------

- node.js
- grunt-cli installed globally (npm i -g grunt-cli)
- bower installed globally (npm i -g bower)
- MongoDB (http://docs.mongodb.org/manual/installation/)
- Elasticsearch

MongoDB Notes
-------------

MongoDB is used to store relevant data for users.

When running in development mode:
The necessary MongoDB collections are newly instantiated each time the application starts and auto populated with records specified in server/config/seed.js. 

Similarly, in a production environment a user would be supplied in the request header, but in development, the header will be auto populated with the mock user specified in the seed.js file. 

Elasticsearch Setup
-------------------

Refer to installation instructions at www.elastic.co/downloads/elasticsearch. DIG can be configured and used with any document corpus which can be loaded and indexed into Elasticsearch. If the Elasticsearch server is installed on a host machine other than the machine which dig executes, it will be necessary to either configure a reverse proxy and DIG to direct all Elasticsearch requests through the proxy first, or to enable CORS in Elasticsearch (refer to Elasticsearch reference).
A sample data set and installer can be used in initialize Elasticsearch. This is found in dig/data/ import_test_data.sh.
Depending on the version of Elasticsearch (>= 1.4.x), it may be necessary to add add **http.cors.enabled : true** to elasticsearch.yml in the config directory of Elasticsearch

Contributing to DIG
-------------------

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

Configuration
-------------

Various application parameters can be configured via environment variables - these parameters are assigned default values in server/config/environment/index.js.  The values in the files development.js and production.js override the values in index.js when DIG is run in development and production mode, respectively.  The parameters are:

- NODE_ENV: determines whether DIG runs in production or development mode (default: 'development')
- PORT: The port on which the application listens for browser requests (default: 9000)
- EUI_SERVER_URL: The base URL at which ELasticsearch can be found (default: 'http://localhost')
- EUI_SERVER_PORT: The port on which to connect to Elasticsearch (default: 9200)
- EUI_SEARCH_INDEX: The name of the Elasticsearch index (default: 'dig')
- BLUR_IMAGES: Determines whether images linked to in the Elasticsearch data are blurred in the user interface (default: 'blur')
- BLUR_PERCENT: Set the amount of image blurring (default: 2.5)
- MONGOHQ_URL: The MongoDB connection string (default: 'mongodb://localhost/dig').  In development mode, this variable is ignored and the MongoDB URL is set to 'mongodb://localhost/dig-dev'

Deployment
----------

To package the application for deployment:

  `grunt build # builds the application and prepares the dist/ directory`

  `bash ./package.sh # create a makeself archive that can be used to easily deploy dig` **(please note that this requires that makeself is installed on your system)**`

The `package.sh` script creates `dig_deploy.sh`.  Running `dig_deploy.sh` will extract the dig application and download docker-compose into a directory called `dig/`.  Inside the `dig/` directory is `run.sh` which can be used to run the dig application as a daemon.

All deployment configuration for dig is done by modifying the docker-compose.yml file in the `dig/` directory.


