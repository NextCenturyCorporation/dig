# DIG

DIG is a visual analysis tool based on a faceted search engine that enables rapid, interactive exploration of large data sets. Users refine their queries by entering search terms or selecting values from lists of aggregated attributes. DIG can be quickly configured for a new domain through simple configuration. 

## Prerequisites
- [node.js]
- [grunt-cli] installed globally (npm i -g grunt-cli)
- [Bower] installed globally (npm i -g bower)
- [mongoDB] [installed locally for development](http://docs.mongodb.org/manual/installation/)
- [Elasticsearch]

### mongoDB Notes

MongoDB is used to store relevant data for users.

When running in development mode:
The necessary MongoDB collections are newly instantiated each time the application starts and auto populated with records specified in server/config/seed.js. 

Similarly, in a production environment a user would be supplied in the request header, but in development, the header will be auto populated with the mock user specified in the seed.js file. 

### Elasticsearch Setup

Refer to installation instructions at www.elastic.co/downloads/elasticsearch. DIG can be configured and used with any document corpus which can be loaded and indexed into Elasticsearch. If the Elasticsearch server is installed on a host machine other than the machine which dig executes, it will be necessary to either configure a reverse proxy and DIG to direct all Elasticsearch requests through the proxy first, or to enable CORS in Elasticsearch (refer to Elasticsearch reference).
A sample data set and installer can be used in initialize Elasticsearch. This is found in dig/data/ import_test_data.sh.
Depending on the version of Elasticsearch (>= 1.4.x), it may be necessary to add add **http.cors.enabled : true** to elasticsearch.yml in the config directory of Elasticsearch

# Contributing to DIG

[dig] is built upon the [Yoeman] based [AngularJS Full-Stack Generator]. To use the yeoman angular-fullstack-generator to create new components for
this application, see the documentation at
[documentation][AngularJS Full-Stack Generator] which has useful generators to
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

## Setting Your Environment Variables

Various application parameters can be configured via environment variables - these parameters are assigned default values in server/config/environment/index.js.  The values in the files development.js and production.js override the values in index.js when DIG is run in development and production mode, respectively.  The parameters are:

| Variable  | Default  Value | Description |
| :------------ | :--------------- | :----- |
| NODE_ENV | 'development' | Determines whether DIG runs in production or development mode.  ['development, 'test', 'production'] |
| PORT | 9000 | The port on which the application listens for browser requests |
| EUI_SERVER_URL | 'http://localhost' | The base URL at which [Elasticsearch] can be found |
| EUI_SERVER_PORT | 9200 | The port on which to connect to [Elasticsearch] |
| EUI_SEARCH_INDEX | 'dig' | The name of the [Elasticsearch] index |
| BLUR_IMAGES | 'blur' | Determines whether images linked to the [Elasticsearch] data are blurred in the user interface |
| BLUR_PERCENT | 2.5 | The amount of image blurring |
| MONGOHQ_URL | 'mongodb://localhost/dig-dev' | In development mode, this variable is ignored and the default value is used |


## Deployment

To package the application for deployment:

  `grunt build # builds the application and prepares the dist/ directory`

  `bash ./package.sh # create a makeself archive that can be used to easily deploy dig` **(please note that this requires that makeself is installed on your system)**`

The `package.sh` script creates `dig_deploy.sh`.  Running `dig_deploy.sh` will extract the dig application and download docker-compose into a directory called `dig/`.  Inside the `dig/` directory is `run.sh` which can be used to run the dig application as a daemon.

All deployment configuration for dig is done by modifying the docker-compose.yml file in the `dig/` directory.

## Configuration Files
This section of the [dig] README will highlight [dig]-specific configuration elements.

### Overview
[dig] manages system and User Interface (UI) configuration variables server-side.  Both system and UI variables are defined within `server/config/environment/index.js`.  [dig] loads this file when the system starts.  `server/app.js` uses system configuration elements as necessary or passes them along to server-side modules. `server/routes.js` defines a `/config` REST enpoint that returns all UI configuration elements within a JSON object.

The UI is built upon the [AngularJS] framework and loads configuration variables during the bootstrapping phase of [dig]'s [AngularJS] application.  The [dig] app pulls variabes via the `/config` REST endpoint and stores them as [AngularJS] constants or values.

### Environment Variables

Some configuration elements such as SECRET KEYS, or server-specific addresses and ports are inappropriate to store in Github managed files.  See the [Setting Your Environment Variables][] section for [dig]'s core variables.  Note that the `server/config/local.env.js` file can provide overrides to environment variables.  This file is loaded prior to `server/config/environment/index.js`, so environment variables can be used within the primary configuration file.

### Elastic Search Index
The application is currently configured to use an internal ElasticSearch service.  To change this configuration, modify the **euiHost** variable in `client/app/app.js`.

>Depending on version (>= 1.4.x), it may be necessary to add **http.cors.enabled : true** to elasticsearch.yml in the config directory of ElasticSearch

### User Interface

The dig user interface is built from a series of templates that define the primary search forms,
the listing view, the details view, etc.  To allow for quick reconfiguration and begin decoupling the templates from the underlying data store, templates reference a configuration parameter passed from
the server.   This parameter, *euiConfigs*, contains descriptions of the search controls, facets, and
data fields that should be displayed for a particular dataset.  At present, a dataset corresponds
to the elasticSearchIndex used to pull data from an ElasticSearch service.  The following sections describe the major elements of this configuration object.

#### euiConfigs Structure

    euiConfigs: {
        '<dataset name | elastic search index id>': {
            facets: {
                euiFilters: [{
                    title: '<field label>',
                    type: 'eui-filter',
                    field: '<document field>',
                    terms: 'phone'
                }],
                aggFilters: [{
                    title: '<field label>',
                    type: 'eui-aggregation',
                    field: '<document field>',
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
                    '<document field>',
                    '<document field>'
                ]
            },
            sort: {},
            listfields: {
                // See the [Listing View Fields] section
            },
            detailsFields: {
                // See the [Details View Fields] section
            }
        }
    }
> For brevity, listFields and detailsFields are described in the
> [Listing View Fields][] and [Details View Fields][] sections below.

The UI passes each result object to the listing templates via a "doc"
variable.  Thus, the &lt;document field&gt; configuration to display the name
of a result would be 'doc.name'.

Note that in most cases, document attributes often passed through an [AngularJS]
$eval for display.   Thus, basic attribute references can be replaced by
angular expressions to decorate the values before display.  Examples:

    field: "doc.name"
    field: "doc.some_primary_value || doc.some_alternate_value"
    field: "doc._source.dateCreated | date:'MM/dd/yyyy HH:mm:ss UTC'"

##### Facets



##### Highlights

The highlight section provides a list of fields in which search terms should be highlighted when rendered to the screen.  A highlight may be as simple as a yellow background behind <span style="background: #ffff00;">matching document text</span>.

##### Sorting Fields

##### Listing View Fields

    listFields: {
        title: [{
            title: '<field label>',
            field: '<document field>',
        }],
        short: [{
            title: 'Field 1 Label',
            field: '<document field>',
            classes: 'date'
        },{
            title: 'Field 2 Label',
            field: '<document field>',
            classes: 'location'
        }],
        full: {
            "1": {
                classes: 'section1-css-class',
                fields: [{
                    title: '<field label>',
                    field: '<document field>',
                    featureArray: '<document field>; used when fields can be an array',
                    featureValue: 'the key of the attribute to display if featureArray contains Objects'
                }]
            },
            "2": {
                classes: 'section2-css-class anoter-section2-css-class',
                fields: [{
                    title: '<field label>',
                    field: 'doc._source.hasFeatureCollection.person_name_feature.person_name',
                    featureArray: '<document field>; used when fields can be an array',
                    featureValue: 'the key of the attribute to display if featureArray contains Objects'
                }]
            }

When using [dig] to search an elastic search index, the results are provided in
a simple, paged list view by default.  Items in this view have a 'short' description
useful for displaying the first few key fields of a result.  Additionally,
results can be clicked on to provide a 'full' listing view.  The full description is a
more informative slide out display that may or may not include images and may include all values of a
particular result field.  The full fiew may include multiple sections, each
possibly set off by their own CSS class and containing one or more fields.
However, this view is not intended to display the superset
of fields for a result document.  That duty is left to the [Details View](). The
'title' configuration denotes the result field to be used as the title field for the
listing in either the short or full descriptive views.  A title field may be rendered
as bold text or with a title CSS style.

Descriptions for the configuration object attributes in the JSON block above are provided below:

| Key  | Description  | Examples |
| :------------ | :--------------- | :----- |
| classes | A list of CSS class names to use on this element | title alert |
| field  | A document field value to display.  Use this for primitive values  | doc.name |
| fieldArray | A document array value to display.  Use this for multi-valued fields.  | doc.aliases |
| fieldValue | An object attribute. This is necessary if fieldArray contains objects instead of primitives | value |
| title | A descriptive label to identify a field | Source, URL, Name |


> Both field and fieldArray can be defined.  This is useful for result attributes that
> may be returned as either a single value OR an array of values, potentially named
> differently.  Example:  doc.address.value vice doc.addresses

> Section keys (i.e., "1" and "2" above) are not displayed on the page.
> Using meaningful names instead of numbers may provide a convenience for the developer.
> However, note that their order in the rendered listing is determined by the alphabetical ordering of their key values.

### Details View Fields

    detailFields: {
        "1": {
            classes: 'listing-details',
            fields: [{
                title: '<field label>',
                field: '<document field>',
                featureArray: '<document field>; used when fields can be an array',
                featureValue: 'the key of the attribute to display if featureArray contains Objects'
                hideIfMissing: false
            }]
        },
        "2": {
            classes: 'listing-details',
            fields: [{
                title: '<field label>',
                field: '<document field>'
            },{
                title: '<field label>',
                field: '<document field>',
                featureArray: '<document field>; used when fields can be an array',
                featureValue: 'the key of the attribute to display if featureArray contains Objects'
                hideIfMissing: true
            }]
        }
    }

The [dig] details view provides a complete description of a single search result,
including all available fields of that result.  Typically, this will be a full
page view of a single result.  The details view is similar to the 'full' view
of a listing described in the previous section--it is
organized into multiple sections of one or more result fields.

Descriptions for the configuration object attributes in the JSON block above are provided below:

| Key  | Description  | Examples |
| :------------ | :--------------- | :----- |
| classes | A list of CSS class names to use on this element | title alert |
| field  | A document field value to display.  Use this for primitive values  | doc.name |
| fieldArray | A document array value to display.  Use this for multi-valued fields.  | doc.aliases |
| fieldValue | An object attribute. This is necessary if fieldArray contains objects instead of primitives | value |
| hideIfMissing |Boolean value; true, if this field and its label should be hidden when either field or fieldArray is undefined in a result | true, false |
| title | A descriptive label to identify a field | Source, URL, Name |

> Both field and fieldArray can be defined.  This is useful for result attributes that
> may be returned as either a single value OR an array of values, potentially named
> differently.  Example:  doc.address.value vice doc.addresses

> Section keys (i.e., "1" and "2" above) are not displayed on the page.
> Using meaningful names instead of numbers may provide a convenience for the developer.
> However, note that their order in the rendered listing is determined by the alphabetical ordering of their key values.

### Image Field

### Image Blurring

[AngularJS]: https://www.angularjs.org/
[AngularJS Full-Stack Generator]: https://github.com/DaftMonk/generator-angular-fullstack
[Bower]: http://bower.io/
[dig]: https://github.com/NextCenturyCorporation/dig
[Elasticsearch]: https://www.elastic.co/products/elasticsearch
[grunt-cli]: https://github.com/gruntjs/grunt-cli
[mongoDB]: http://www.mongodb.org/
[node.js]: https://nodejs.org/
[Yoeman]: http://yeoman.io/
