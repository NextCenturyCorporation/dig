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
                    title: 'Example',
                    type: 'eui-filter',
                    field: '<document field>',
                    terms: 'phone'
                }],
                simFilter: {
                    title: 'Image',
                    type: 'simFilter',
                    field: '<document field>'
                },
                aggFilters: [{
                    title: 'Label Name',
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
[grunt-cli]: https://github.com/gruntjs/grunt-cli
[node.js]: https://nodejs.org/
[Yoeman]: http://yeoman.io/
