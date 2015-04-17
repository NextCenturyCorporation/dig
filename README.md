#dig

This is the software project for Dig search application.

##Prerequisites
- [node.js]
- [grunt-cli] installed globally (npm i -g grunt-cli)
- [Bower] installed globally (npm i -g bower)

To use the yeoman angular-fullstack-generator to create new components for
the application, see the documentation at 
[AngularJS Full-Stack Generator] which has useful generators to
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

##Configuration
The [dig] project was seeded by the [Yoeman] based [AngularJS Full-Stack Generator]. The overall maintenance of the project structure and new module generation is facilitated by those tools.  To understand the full suite of configuration options, please review their documentation.  This section of the [dig] README will highlight [dig]-specific configuration elements.

### Configuration File Overview
[dig] generally manages system and User Interface (UI) configuration variables server-side.  Both system and UI variables are defined within `server/config/environment/index.js`.  [dig] loads this file when the system starts.  `server/app.js` uses system configuration elements as necessary or passes them along to server-side modules. `server/routes.js` defines a `/config` REST enpoint that returns all UI configuration elements within a JSON object.

The UI is built upon the [AngularJS] framework and loads configuration variables during the bootstrapping phase of [dig]'s [AngularJS] application.  The [dig] app pulls variabes via the `/config` REST endpoint and stores them as [AngularJS] constants or values.

### Environment Variables

Some configuration elements such as SECRET KEYS, or server-specific addresses and ports are inappropriate to store in Github managed files.  [dig] loads these configuration elements from environment variables.  `server/config/local.env.sample.js` provides a sample use of environment variables.  `server/config/local.env.js` will be loaded prior to `server/config/environment/index.js` so environment variables can be used within the primary configuration file.

### Elastic Search Index
The application is currently configured to use an internal ElasticSearch service.  To change this configuration, modify the **euiHost** variable in `client/app/app.js`.

>Depending on version (>= 1.4.x), it may be necessary to add **http.cors.enabled : true** to elasticsearch.yml in the config directory of ElasticSearch

### User Interface
#### Structure

    euiConfigs: {
        '<dataset name>': {
            facets: {
                euiFilters: [{
                    title: 'Example',
                    type: 'eui-filter',
                    field: '<document attribute>',
                    terms: 'phone'
                }],
                simFilter: {
                    title: 'Image',
                    type: 'simFilter',
                    field: '<document attribute>'
                },
                aggFilters: [{
                    title: 'Label Name',
                    type: 'eui-aggregation',
                    field: '<document attribute>',
                    terms: '<document attribute array>',
                    termsType: 'string|number'
                    count: '30'
                },
                dateFilters:[{
                    title: 'Date Field Label',
                    aggName: 'date_agg',
                    field: 'dateCreated'
                }]
            },
            highlight: {
                fields: [
                    '<document attribute>',
                    '<document attribute>'
                ]
            },
            sort: {}
        }
    }

### User Interface: Search Controls

#### Facets

#### Highlights

#### Sorting Fields

### User Interface: Listing View Fields

#### Titles

#### Short Description

#### Full Description

### User Interface: Details View Fields

### Image Field

### Image Blurring

[AngularJS]: https://www.angularjs.org/
[AngularJS Full-Stack Generator]: https://github.com/DaftMonk/generator-angular-fullstack
[Bower]: http://bower.io/
[dig]: https://github.com/NextCenturyCorporation/dig
[grunt-cli]: https://github.com/gruntjs/grunt-cli
[node.js]: https://nodejs.org/
[Yoeman]: http://yeoman.io/