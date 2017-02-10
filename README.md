# DIG v2+

If you're looking for the latest version of DIG, please visit https://github.com/NextCenturyCorporation/digapp-ht

# DIG 1

DIG is a visual analysis tool based on a faceted search engine that enables rapid, interactive exploration of large data sets. Users refine their queries by entering search terms or selecting values from lists of aggregated attributes. DIG can be quickly configured for a new domain through simple configuration. 

## Prerequisites
- [Node.js]
- [grunt-cli] installed globally (npm i -g grunt-cli)
- [Bower] installed globally (npm i -g bower)
- [MySQL]
- [Elasticsearch]


### Elasticsearch Setup

Refer to installation instructions at www.elastic.co/downloads/elasticsearch. DIG can be configured and used with any document corpus which can be loaded and indexed into Elasticsearch. If the Elasticsearch server is installed on a host machine other than the machine which dig executes, it will be necessary to either configure a reverse proxy and DIG to direct all Elasticsearch requests through the proxy first, or to enable CORS in Elasticsearch (refer to Elasticsearch reference).
A sample data set and installer can be used in initialize Elasticsearch. This is found in dig/data/ import_test_data.sh.
Depending on the version of Elasticsearch (>= 1.4.x), it may be necessary to add add **http.cors.enabled : true** to elasticsearch.yml in the config directory of Elasticsearch

# Contributing to DIG

[DIG] is built upon the [Yeoman] based [AngularJS Full-Stack Generator]. To use the yeoman angular-fullstack-generator to create new components for
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
| EUI_SEARCH_INDEX | 'dig-latest' | The name of the [Elasticsearch] index |
| EUI_SEARCH_TYPE | 'WebPage' | The ElasticSearch document type |
| BLUR_IMAGES | 'true' | Determines whether images linked to the [Elasticsearch] data are blurred in the user interface |
| BLUR_PERCENT | 2.5 | The amount of image blurring |
| DB_USER |  | user used by application to connect to DB| (leave blank for dev/sqlite)
| DB_PASS |  | password used by applicaion to connect to DB (leave blank for dev/sqlite) |
| DB_HOST |  | hostname of db (leave blank for dev/sqlite) |
| DB_PORT | 3306 | port for mysql db service |
| ES_USER |  | user name for elasticsearch |
| ES_PASS |  | user password for elasticsearch |
| EUI_SERVER | 'localhost' | The host at which [Elasticsearch] can be found |
| MYSQL_ROOT_PASSWORD |  |  |


## Deployment

  `grunt build # builds the application and prepares the dist/ directory`

To package the application for deployment:

  `bash ./scripts/package.sh # create a makeself archive that can be used to easily deploy dig` **(please note that this requires that makeself is installed on your system)**`

The `package.sh` script creates `dig_deploy.sh`.  Running `dig_deploy.sh` will extract the dig application and download docker-compose into a directory called `dig/`.  Inside the `dig/` directory is `run.sh` which can be used to run the dig application as a daemon.

All deployment configuration for dig is done by modifying the docker-compose.yml file in the `dig/` directory.

## Configuration Files
This section of the [DIG] README will highlight [DIG]-specific configuration elements.

### Overview
[DIG] manages system and User Interface (UI) configuration variables server-side.  Both system and UI variables are defined within `server/config/environment/index.js`.  [DIG] loads this file when the system starts.  `server/app.js` uses system configuration elements as necessary or passes them along to server-side modules. `server/routes.js` defines a `/config` REST endpoint that returns all UI configuration elements within a JSON object.

The UI is built upon the [AngularJS] framework and loads configuration variables during the bootstrapping phase of [DIG]'s [AngularJS] application.  The [DIG] app pulls variabes via the `/config` REST endpoint and stores them as [AngularJS] constants or values.

### Environment Variables
Some configuration elements such as SECRET KEYS, or server-specific addresses and ports are inappropriate to store in Github managed files.  See the 
[Setting Your Environment Variables](#setting-your-environment-variables) section for [DIG]'s core variables.  Note that the `server/config/local.env.js` file can provide overrides to environment variables.  This file is loaded prior to `server/config/environment/index.js`, so environment variables can be used within the primary configuration file.

### Elastic Search Index
The application is currently configured to use an internal Elasticsearch service.  To change this configuration, modify the **euiHost** variable in `client/app/app.js` or set the **EUI_SEARCH_INDEX** environment variable.

>Depending on version (>= 1.4.x), it may be necessary to add **http.cors.enabled : true** to elasticsearch.yml in the config directory of Elasticsearch

### User Interface

The dig user interface is built from a series of templates that define the primary search forms,
the listing view, the details view, etc.  To allow for quick reconfiguration and begin decoupling the templates from the underlying data store, templates reference a configuration parameter passed from
the server.   This parameter, **euiConfigs**, contains descriptions of the search controls, facets, and
data fields that should be displayed for a particular dataset.  At present, a dataset corresponds
to the Elasticsearch index used to pull data from an Elasticsearch service.  The following sections describe the major elements of this configuration object.

#### euiConfigs Structure

``` javascript
euiConfigs: {
    '<dataset name | elastic search index id>': {
        facets: {
            euiFilters: [{
                title: '<field label>',
                field: '<document field>',
                terms: '<document array field>'
            }],
            aggFilters: [{
                title: '<field label>',
                field: '<document field>',
                terms: '<document array field>',
                nestedPath: 'partial path to <document field>',
                termsType: '<string|number>'
                count: '30'
            },
            dateFilters:[{
                title: '<date field label>',
                aggName: 'date_agg',
                field: '<document date field>'
            }]
        },
        lastUpdateQuery: {
            field: '<document field>'
        },
        highlight: {
            fields: [
                '<document field>',
                '<document field>'
            ]
        },
        sort: {
            // see the Sorting section
        },
        offerFields: {
            // See the Offer View Fields section
        },
        threadFields: {
            // See the Thread View Fields section
        },
        detailFields: {
            // See the Details View Fields section
        }
    }
}
```

> For brevity, **offerFields**, **threadFields**, and **detailFields** are described in the
> [Offer View Fields](#offer-view-fields), [Thread View Fields](#thread-view-fields) and [Details View Fields](#details-view-fields) sections below.

Note that in most cases, document attributes often passed through an [AngularJS]
$eval for display.   Thus, basic attribute references can be replaced by
angular expressions to decorate the values before display.  Examples:

``` javascript
field: "doc.name"
field: "doc.some_primary_value || doc.some_alternate_value"
field: "doc._source.dateCreated | date:'MM/dd/yyyy HH:mm:ss UTC'"
```

> By convention, controls that impact an entire result set refer to document fields simply by their name (e.g., name, dateCreate, color).  Controls or display fields that are shown for each document in a result set refer to document fields as sub-elements of a 'doc'.  (e.g., doc.name, doc.dateCreated, doc.color). Facets, sorting, and highlights use the former style while listingFields and detailsFields use the latter.

#### Facets

Facets define the document fields on which we want to aggregate and filter our search results.  In the user interface, they are most recognized by their controls:  search boxes, checkboxes, and calendars.  The primary facet types in the euiConfigs object are euiFilters, aggFilters, and dateFilters.  

**euiFilters** are text filters that will refine a search based on text matches to a particular document field.  

**aggFilters** will calculate the aggregate number of documents matching each unique value of a particular document field.  These are rendered as a series of checkboxes that will filter the search results on particular values.  For example, an aggFilter on a color field may yield checkboxes for red, green, and blue which would allow a user to display only 'red' search results, if red was checked.

**dateFilters** will filter all search results on a date range.  These filters must be attached to fields or terms that are stored as Date objects.  Each dateFilter appears on the UI as a TO/FROM control that allows the user to specify both a start and end date via a text field or calendar.

Descriptions for the configuration object attributes in the **facets** block above are provided below:

| Key  | Description  | Examples |
| :------------ | :--------------- | :----- |
| aggName | A custom name to use for the Elasticsearch results aggregation on date fields | date_agg |
| count | The number of unique values to display by default.  This pertains only to aggFilters. | 30 |
| field | A document field value to display. Use this for primitive values | name |
| nestedPath | If a field is nested, a nested aggregation will have to be used and the path to the field will have to be given | 'address.line1' for the field 'address.line1.street' |
| terms | A document field array to display.  Use this for multi-valued fields.  | phonenumbers |
| termsType | A type field for the terms field. This is used for fields that may be ambiguous when they are parsed from text (e.g., string fields that contain only digits).  Accepted values are 'string' or 'number' | 'string' |
| title | A descriptive label to identify a field | Date, Color, Size |

#### Highlights

The **highlight** section provides a list of fields in which search terms should be highlighted when rendered to the screen.  A highlight may be as simple as a yellow background behind <span style="background: #ffff00;">matching document text</span>.

#### Last Update Query

The **last update query** defines the field on which the application should query on in order to determine how recently records have been updated. 

#### Sorting

``` javascript
sort: {
    field: '<document field>',
    defaultOption: {
        order: 'rank', title: 'Best Match'
    },
    options: [
        {
            order: 'rank',
            title: 'Best Match'
        },{
            order: 'desc',
            title: 'Newest First'
        },{
            order: 'asc',
            title: 'Oldest First'
        }
    ]
}
```

**sort** defines the parameters of the sort control on the [DIG] UI.  It defineds the document field, default sorting option and available sorting options.  These are mapped to [Elasticsearch] sort orders.  To change the sorting field, use the example above and simply change the *field* value to the desired document field (e.g., dateCreated, name).

#### Offer View Fields

``` javascript
offerFields: {
    type: '<document type>'
    title: [{
        title: '<field label>',
        field: '<document field>',
    }],
    short: [{
        title: 'Field 1 Label',
        field: '<document field>',
        classes: '<CSS class list>'
    },{
        title: 'Field 2 Label',
        field: '<document field>',
        classes: '<CSS class list>'
    }],
    full: {
        "1": {
            classes: '<CSS class list>',
            fields: [{
                title: '<field label>',
                field: '<document field>',
                featureArray: '<document field>; used when fields can be an array',
                featureValue: 'the key of the attribute to display if featureArray contains Objects'
            }]
        },
        "2": {
            classes: '<CSS class list>',
            fields: [{
                title: '<field label>',
                field: 'doc._source.hasFeatureCollection.person_name_feature.person_name',
                featureArray: '<document field>; used when fields can be an array',
                featureValue: 'the key of the attribute to display if featureArray contains Objects'
            }]
        }
    }
}
```

When using [DIG] to search an [Elasticsearch] index, the results are provided in
a simple, paged view by default.  In most cases, the records will fit this offer model.  Items in this 
view have a *short* description useful for displaying the first few key fields of a result.  Additionally,
results can be clicked on to provide a *full* listing view.  The full description is a
more informative slide out display that may or may not include images and may include all values of a
particular result field.  The full view may include multiple sections, each
possibly set off by their own CSS class and containing one or more fields.
However, this view is not intended to display the superset
of fields for a result document.  That duty is left to the [Details View](). The
'title' configuration denotes the result field to be used as the title field for the
listing in either the short or full descriptive views.  A title field may be rendered
as **bold text** or with a **TITLE** CSS style.

Descriptions for the configuration object attributes in the **offerFields** block above are provided below:

| Key  | Description  | Examples |
| :------------ | :--------------- | :----- |
| type | Type specified either in doc._type or doc._source.a field | doc._type 
| classes | A list of CSS class names to use on this element | title info section-1 |
| field  | A document field value to display.  Use this for primitive values  | doc.name |
| fieldArray | A document array value to display.  Use this for multi-valued fields.  | doc.aliases |
| fieldValue | An object attribute. This is necessary if fieldArray contains objects instead of primitives | value (resolves to doc.aliases.value here) |
| title | A descriptive label to identify a field | Source, URL, Name |
| highlightArray | If you want to highlight text and the field you are highlighting returns an array of results, this can be used to parse through that array for the correct one | doc.highlight['name']

> Both field and fieldArray can be defined.  This is useful for result attributes that
> may be returned as either a single value OR an array of values, potentially named
> differently.  Example:  doc.address.value vice doc.addresses

> Section keys (i.e., "1" and "2" above) are not displayed on the page.
> Using meaningful names instead of numbers may provide a convenience for the developer.
> However, note that their order in the rendered listing is determined by the alphabetical ordering of their key values.

#### Details View Fields

``` javascript
detailFields: {
    title: {
        title: '<field label>',
        field: '<document field>',
    },
    sections: {
        "1": {
            classes: '<CSS class list>',
            fields: [{
                title: '<field label>',
                field: '<document field>',
                featureArray: '<document field>; used when fields can be an array',
                featureValue: 'the key of the attribute to display if featureArray contains Objects'
                hideIfMissing: false
            }]
        },
        "2": {
            classes: '<CSS class list>',
            fields: [{
                title: '<field label>',
                field: '<document field>'
            },{
                title: '<field label>',
                field: '<document field>',
                featureArray: '<document field>; used when fields can be an array',
                featureValue: 'the key of the attribute to display if featureArray contains Objects'
                highlightArray: '<document field>'
                hideIfMissing: true
            }]
        }
    }
}
```

The [DIG] details view provides a complete description of a single search result,
including all available fields of that result.  Typically, this will be a full
page view of a single result.  The details view is similar to the *full* view
of a listing described in the previous section--it is
organized into multiple sections of one or more result fields.

Descriptions for the configuration object attributes in the **detailFields** block above are provided below:

| Key  | Description  | Examples |
| :------------ | :--------------- | :----- |
| classes | A list of CSS class names to use on this element | title info section-1 |
| field  | A document field value to display.  Use this for primitive values  | doc.name |
| fieldArray | A document array value to display.  Use this for multi-valued fields.  | doc.aliases |
| fieldValue | An object attribute. This is necessary if fieldArray contains objects instead of primitives | value (resolves to doc.aliases.value here) |
| hideIfMissing |Boolean value; true, if this field and its label should be hidden when either field or fieldArray is undefined in a result | true, false |
| title | A descriptive label to identify a field | Source, URL, Name |

> Both field and fieldArray can be defined.  This is useful for result attributes that
> may be returned as either a single value OR an array of values, potentially named
> differently.  Example:  doc.address.value vice doc.addresses

> Section keys (i.e., "1" and "2" above) are not displayed on the page.
> Using meaningful names instead of numbers may provide a convenience for the developer.
> However, note that their order in the rendered listing is determined by the alphabetical ordering of their key values.

#### Thread View Fields

``` javascript
threadFields: {
    type: '<document type>'
    title: [{
        title: '<field label>',
        field: '<document field>',
    }],
    short: [{
        title: 'Field 1 Label',
        field: '<document field>',
        classes: '<CSS class list>'
    },{
        title: 'Field 2 Label',
        field: '<document field>',
        classes: '<CSS class list>'
    }],
    full: {
        "1": {
            classes: '<CSS class list>',
            fields: [{
                title: '<field label>',
                field: '<document field>',
                featureArray: '<document field>; used when fields can be an array',
                featureValue: 'the key of the attribute to display if featureArray contains Objects'
            }]
        },
        "2": {
            classes: '<CSS class list>',
            fields: [{
                title: '<field label>',
                field: '<document field>',
                featureArray: '<document field>; used when fields can be an array',
                featureValue: 'the key of the attribute to display if featureArray contains Objects'
            }]
        }
    },
    postFields: {
        field: '<document field>',
        name: '<field label>',
        subject: [{
            title: '<field label>',
            field: '<document field>',
            highlightArray: '<document field>'
        }],
        short: [{
            title: '<field label>',
            field: '<document field>',
            highlightArray: '<document field>',
            classes: '<CSS class list>'
        }],
        body: {
            title: '<field label>',
            field: '<document field>',
            highlightArray: '<document field>'
        },
        signature: {
            title: '<field label>',
            field: '<document field>',
            highlightArray: '<document field>',
        }
    }
}
```

Alternatively, the data you are trying to render may fit the thread template rather than an offer. The *short* listing looks the same, but 
the *full* listing is a bit different. A thread will have key fields listed, as well as a list of associated posts under that particular 
thread. Within a post, there are a short listing of fields (i.e. author, date), a subject, a body of text, and possibly a signature 
or footer for that post. 

Descriptions for the configuration object attributes in the **threadFields** block above are provided below:

| Key  | Description  | Examples |
| :------------ | :--------------- | :----- |
| type | Type specified either in doc._type or doc._source.a field | doc._type 
| classes | A list of CSS class names to use on this element | title info section-1 |
| field  | A document field value to display.  Use this for primitive values  | doc.name |
| fieldArray | A document array value to display.  Use this for multi-valued fields.  | doc.aliases |
| fieldValue | An object attribute. This is necessary if fieldArray contains objects instead of primitives | value (resolves to doc.aliases.value here) |
| title | A descriptive label to identify a field | Source, URL, Name |
| highlightArray | If you want to highlight text and the field you are highlighting returns an array of results, this can be used to parse through that array for the correct one | doc.highlight['name']

> Both field and fieldArray can be defined.  This is useful for result attributes that
> may be returned as either a single value OR an array of values, potentially named
> differently.  Example:  doc.address.value vice doc.addresses

> Section keys (i.e., "1" and "2" above) are not displayed on the page.
> Using meaningful names instead of numbers may provide a convenience for the developer.
> However, note that their order in the rendered listing is determined by the alphabetical ordering of their key values.


#### Image Field

This entry specifies which document field, if any, contains a representative image of an individual search result. Example:  

``` javascript
imageField: 'hasImage.imageURL'
```

#### Debug Fields

For debugging purposes only, the **debugFields** list allows a developer to inject fields into each listing that may help with testing but should not be displayed to a user.  Document IDs fall into this category.  If this field is not defined, then the UI will not render the area for them.

``` javascript
debugFields: {
    fields: ['doc._id']
}
```

[AngularJS]: https://www.angularjs.org/
[AngularJS Full-Stack Generator]: https://github.com/DaftMonk/generator-angular-fullstack
[Bower]: http://bower.io/
[DIG]: https://github.com/NextCenturyCorporation/dig
[Elasticsearch]: https://www.elastic.co/products/elasticsearch
[grunt-cli]: https://github.com/gruntjs/grunt-cli
[MongoDB]: http://www.mongodb.org/
[Node.js]: https://nodejs.org/
[Yeoman]: http://yeoman.io/
