'use strict';

var path = require('path');
var _ = require('lodash');
var pjson = require('../../../package.json');

function requiredProcessEnv(name) {
    if(!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(__dirname + '/../../..'),

    // Server port
    port: process.env.PORT || 9000,

    // Should we populate the DB with sample data?
    seedDB: false,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: 'dig-secret'
    },

    // List of user roles
    userRoles: ['guest', 'user', 'admin', 'disabled'],

    // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },

    appVersion: pjson.version,

    euiServerUrl: process.env.EUI_SERVER_URL || 'http://localhost',
    euiServer: process.env.EUI_SERVER || 'localhost',
    euiServerPort: process.env.EUI_SERVER_PORT || 9200,
    dbServerUser: process.env.DB_SERVER_USER,
    dbServerPass: process.env.DB_SERVER_PASS,
    euiSearchIndex: process.env.EUI_SEARCH_INDEX || 'dig-latest',
    euiSearchType: process.env.EUI_SEARCH_TYPE || 'WebPage',

    imageSimUrl: process.env.IMAGE_SIM_URL || 'http://localhost',
    imageSimPort: process.env.IMAGE_SIM_PORT || 3001,

    blurImages: ((!!process.env.BLUR_IMAGES && process.env.BLUR_IMAGES === 'false') ? false : true),
    blurPercentage: process.env.BLUR_PERCENT || 2.5,

    euiConfigs: {
        'mockads': {
            facets: {
                aggFilters: [{
                    title: 'State',
                    type: 'eui-aggregation',
                    field: 'state_agg',
                    terms: 'state',
                    termsType: 'string',
                    count: 15
                },{
                    title: 'Ethnicity',
                    type: 'eui-aggregation',
                    field: 'etn_agg',
                    terms: 'ethnicity',
                    termsType: 'string',
                    count: 10
                },{
                    title: 'Hair Color',
                    type: 'eui-aggregation',
                    field: 'hc_agg',
                    terms: 'hair_color',
                    termsType: 'string',
                    count: 10
                },{
                    title: 'Age',
                    type: 'eui-aggregation',
                    field: 'age_agg',
                    terms: 'age',
                    termsType: 'number',
                    count: 10
                }],
                dateFilters: [{
                    title: 'Date',
                    aggName: 'date_agg',
                    field: 'date'
                }]
            },
            sort: {
                defaultOption: {
                    field: '_score', order: 'desc', title: 'Best Match'
                },
                notificationOption: {
                    field: '_timestamp', order: 'desc', title: 'Date Added to DIG (Newest First)',
                },
                options: [
                    {
                        field: '_score',
                        order: 'desc',
                        title: 'Best Match'
                    },{
                        field: 'date',
                        order: 'desc',
                        title: 'Date Created (Newest First)'
                    },{
                        field: 'date',
                        order: 'asc',
                        title: 'Date Created (Oldest First)'
                    }, {
                        field: '_timestamp',
                        order: 'desc',
                        title: 'Date Added to DIG (Newest First)'
                    }, {
                        field: '_timestamp',
                        order: 'asc',
                        title: 'Date Added to DIG (Oldest First)'
                    }
                ]
            },
            lastUpdateQuery: {
                field: 'date'
            },
            highlight: {
                fields: [
                'title'
                ]
            },
            listFields: {
                title: [{
                    title: 'Title',
                    type: 'title',
                    field: 'doc.highlight["title"][0] || doc._source.title',
                    section: 'title'
                }],
                short: [{
                    title: 'Created',
                    field: "doc._source.date | date:'MM/dd/yyyy HH:mm:ss UTC'",
                    classes: 'date'
                },{
                    title: 'City',
                    field: 'doc._source.city',
                    classes: 'location'
                },{
                    title: 'State',
                    field: 'doc._source.state',
                    classes: 'location'
                },{
                    title: 'Phone',
                    field: 'doc._source.phone',
                    classes: 'phone'
                },{
                    title: 'Name',
                    field: 'doc._source.full_name',
                    classes: 'name'
                },{
                    title: 'Age',
                    field: 'doc._source.age',
                    classes: 'age'
                }],
                full: {
                    "1": {
                        classes: 'listing-details',
                        fields: [{
                            title: 'Name(s)',
                            field: 'doc._source.full_name',
                            featureValue: 'full_name'
                        },{
                            title: 'City',
                            field: 'doc._source.city',
                            featureValue: 'city'
                        },{
                            title: 'State',
                            field: 'doc._source.state',
                            featureValue: 'state'
                        },{                         
                            title: 'Phone Number',
                            field: 'doc._source.phone',
                            featureValue: 'phone'
                        },{
                            title: 'Email',
                            field: 'doc._source.email',
                            featureValue: 'email'
                        },{
                            title: 'Created',
                            field: "doc._source.date | date:'MM/dd/yyyy HH:mm:ss UTC'"
                        }]
                    },
                    "2": {
                        classes: 'person-details',
                        fields: [{
                            title: 'Age',
                            field: 'doc._source.age',
                            featureValue: 'age'
                        },{
                            title: 'Ethnicity',
                            field: 'doc._source.ethnicity',
                            featureValue: 'ethnicity'
                        },{
                            title: 'Hair Color',
                            field: 'doc._source.hair_color',
                            featureValue: 'hair_color'
                        },{
                            title: 'Height',
                            field: 'doc._source.height',
                            featureValue: 'height'
                        },{
                            title: 'Weight',
                            field: 'doc._source.weight',
                            featureValue: 'weight'
                        },{
                            title: 'Added to Dig',
                            field: "doc.fields._timestamp | date:'MM/dd/yyyy HH:mm:ss UTC'"
                        }]
                    }
                }
            },
            debugFields: {
                fields: ['doc._id']
            },
            detailFields: {
                "1": {
                    classes: 'listing-details',
                    fields: [{
                        title: 'Created',
                        field: "doc._source.date | date:'MM/dd/yyyy HH:mm:ss UTC'"
                    },{
                        title: 'Added to DIG',
                        field: "doc.fields._timestamp | date:'MM/dd/yyyy HH:mm:ss UTC'"
                    },{
                        title: 'City',
                        field: 'doc._source.city',
                        featureValue: 'city'
                    },{
                        title: 'State',
                        field: 'doc._source.state',
                        featureValue: 'state'
                    },{  
                        title: 'Phone Number',
                        field: 'doc._source.phone',
                        featureValue: 'phone'
                    },{
                        title: 'Email',
                        field: 'doc._source.email',
                        featureValue: 'email'
                    }]
                },
                "2": {
                    classes: 'listing-details',
                    fields: [{
                        title: 'Name(s)',
                        field: 'doc._source.full_name',
                    },{
                        title: 'Username',
                        field: 'doc._source.username',
                        featureValue: 'username'
                    },{
                        title: 'Age',
                        field: 'doc._source.age',
                        featureValue: 'age'
                    },{
                        title: 'Ethnicity',
                        field: 'doc._source.ethnicity',
                        featureValue: 'ethnicity'
                    },{
                        title: 'Hair Color',
                        field: 'doc._source.hair_color',
                        featureValue: 'hair_color'
                    },{
                        title: 'Height',
                        field: 'doc._source.height',
                        featureValue: 'height'
                    },{
                        title: 'Weight',
                        field: 'doc._source.weight',
                        featureValue: 'weight'
                    },{
                        title: 'Eye Color',
                        field: 'doc._source.eye_color',
                        hideIfMissing: true
                    },{
                        title: 'Smokes',
                        field: 'doc._source.smokes',
                        featureValue: 'smokes',
                        hideIfMissing: true
                    },{
                        title: 'IP Address',
                        field: 'doc._source.ip_address',
                        featureValue: 'ip_address',
                        hideIfMissing: true
                    }]
                }
            }
        },
        'dig-latest': {
            facets: {
                simFilter: {
                    title: 'Image',
                    type: 'simFilter',
                    field: 'hasFeatureCollection.similar_images_feature.featureValue'
                },
                aggFilters: [{
                    title: 'City/Region',
                    type: 'eui-aggregation',
                    field: 'city_agg',
                    terms: 'hasFeatureCollection.place_postalAddress_feature.featureObject.addressLocality',
                    termsType: 'string',
                    count: 30
                },{
                    title: 'Ethnicity',
                    type: 'eui-aggregation',
                    field: 'etn_agg',
                    terms: 'person_ethnicity',
                    termsType: 'string',
                    count: 20
                },{
                    title: 'Hair Color',
                    type: 'eui-aggregation',
                    field: 'hc_agg',
                    terms: 'person_haircolor',
                    termsType: 'string',
                    count: 10
                },{
                    title: 'Age',
                    type: 'eui-aggregation',
                    field: 'age_agg',
                    terms: 'person_age',
                    termsType: 'number',
                    count: 10
                },{
                    title: 'Provider',
                    type: 'eui-aggregation',
                    field: 'provider_agg',
                    terms: 'provider_name',
                    termsType: 'string',
                    count: 10
                }],
                dateFilters: [{
                    title: 'Date',
                    aggName: 'date_agg',
                    field: 'dateCreated'
                }]
            },
            highlight: {
                fields: [
                'hasBodyPart.text',
                'hasTitlePart.text'
                ]
            },
            sort: {
                defaultOption: {
                    field: '_score', order: 'desc', title: 'Best Match'
                },
                notificationOption: {
                    field: '_timestamp', order: 'desc', title: 'Date Added to DIG (Newest First)',
                },
                options: [
                    {
                        field: '_score',
                        order: 'desc',
                        title: 'Best Match'
                    },{
                        field: 'dateCreated',
                        order: 'desc',
                        title: 'Date Created (Newest First)'
                    },{
                        field: 'dateCreated',
                        order: 'asc',
                        title: 'Date Created (Oldest First)'
                    }, {
                        field: '_timestamp',
                        order: 'desc',
                        title: 'Date Added to DIG (Newest First)'
                    }, {
                        field: '_timestamp',
                        order: 'asc',
                        title: 'Date Added to DIG (Oldest First)'
                    }
                ]
            },
            lastUpdateQuery: {
                field: 'dateCreated'
            },
            listFields: {
                title: [{
                    title: 'Title',
                    type: 'title',
                    field: 'doc.highlight["hasTitlePart.text"][0] || doc._source.hasTitlePart.text',
                    section: 'title'
                }],
                short: [{
                    title: 'Created',
                    field: "doc._source.dateCreated | date:'MM/dd/yyyy HH:mm:ss UTC'",
                    classes: 'date'
                },{
                    title: 'Location',
                    field: 'doc._source.hasFeatureCollection.place_postalAddress_feature.featureObject.addressLocality || doc._source.hasFeatureCollection.place_postalAddress_feature[0].place_postalAddress',
                    classes: 'location'
                },{
                    title: 'Phone',
                    field: 'doc._source.hasFeatureCollection.phonenumber_feature.phonenumber || doc._source.hasFeatureCollection.phonenumber_feature[0].phonenumber',
                    classes: 'phone'
                },{
                    title: 'Name',
                    field: 'doc._source.hasFeatureCollection.person_name_feature.person_name || doc._source.hasFeatureCollection.person_name_feature[0].person_name',
                    classes: 'name'
                },{
                    title: 'Age',
                    field: 'doc._source.hasFeatureCollection.person_age_feature.person_age || doc._source.hasFeatureCollection.person_age_feature[0].person_age',
                    classes: 'age'
                }],
                full: {
                    "1": {
                        classes: 'listing-details',
                        fields: [{
                            title: 'Name(s)',
                            field: 'doc._source.hasFeatureCollection.person_name_feature.person_name',
                            featureArray: 'doc._source.hasFeatureCollection.person_name_feature',
                            featureValue: 'person_name'
                        },{
                            title: 'City',
                            field: 'doc._source.hasFeatureCollection.place_postalAddress_feature.featureObject.addressLocality',
                            featureArray: 'doc._source.hasFeatureCollection.place_postalAddress_feature',
                            featureValue: 'place_postalAddress'
                        },{
                            title: 'Phone Number',
                            field: 'doc._source.hasFeatureCollection.phonenumber_feature.phonenumber',
                            featureArray: 'doc._source.hasFeatureCollection.phonenumber_feature',
                            featureValue: 'phonenumber'
                        },{
                            title: 'Email',
                            field: 'doc._source.hasFeatureCollection.emailaddress_feature.emailaddress',
                            featureArray: 'doc._source.hasFeatureCollection.emailaddress_feature',
                            featureValue: 'emailaddress'

                        },{
                            title: 'Web Site',
                            field: 'doc._source.hasFeatureCollection.website_feature.website',
                            featureArray: 'doc._source.hasFeatureCollection.website_feature',
                            featureValue: 'website'
                        },{
                            title: 'Provider',
                            field: 'doc._source.hasFeatureCollection.provider_name_feature.provider_name',
                            featureArray: 'doc._source.hasFeatureCollection.provider_name_feature',
                            featureValue: 'provider_name'
                        },{
                            title: 'Created',
                            field: "doc._source.dateCreated | date:'MM/dd/yyyy HH:mm:ss UTC'"
                        }]
                    },
                    "2": {
                        classes: 'person-details',
                        fields: [{
                            title: 'Age',
                            field: 'doc._source.hasFeatureCollection.person_age_feature.person_age',
                            featureArray: 'doc._source.hasFeatureCollection.person_age_feature',
                            featureValue: 'person_age'
                        },{
                            title: 'Ethnicity',
                            field: 'doc._source.hasFeatureCollection.person_ethnicity_feature.person_ethnicity',
                            featureArray: 'doc._source.hasFeatureCollection.person_ethnicity_feature',
                            featureValue: 'person_ethnicity'
                        },{
                            title: 'Hair Color',
                            field: 'doc._source.hasFeatureCollection.person_haircolor_feature.person_haircolor',
                            featureArray: 'doc._source.hasFeatureCollection.person_haircolor_feature',
                            featureValue: 'person_haircolor'
                        },{
                            title: 'Height',
                            field: 'doc._source.hasFeatureCollection.person_height_feature.person_height',
                            featureArray: 'doc._source.hasFeatureCollection.person_height_feature',
                            featureValue: 'person_height'
                        },{
                            title: 'Weight',
                            field: "doc['_source']['hasFeatureCollection']['person_weight_feature ']['person_weight']",
                            featureArray: "doc['_source']['hasFeatureCollection']['person_weight_feature ']",
                            featureValue: 'person_weight'
                        }]
                    }
                }
            },
            debugFields: {
                fields: ['doc._id']
            },
            detailFields: {
                "1": {
                    classes: 'listing-details',
                    fields: [{
                        title: 'Created',
                        field: "doc._source.dateCreated | date:'MM/dd/yyyy HH:mm:ss UTC'"
                    },{
                        title: 'City',
                        field: 'doc._source.hasFeatureCollection.place_postalAddress_feature.featureObject.addressLocality',
                        featureArray: 'doc._source.hasFeatureCollection.place_postalAddress_feature',
                        featureValue: 'place_postalAddress'
                    },{
                        title: 'Phone Number',
                        field: 'doc._source.hasFeatureCollection.phonenumber_feature.phonenumber',
                        featureArray: 'doc._source.hasFeatureCollection.phonenumber_feature',
                        featureValue: 'phonenumber'
                    },{
                        title: 'Email',
                        field: 'doc._source.hasFeatureCollection.emailaddress_feature.emailaddress',
                        featureArray: 'doc._source.hasFeatureCollection.emailaddress_feature',
                        featureValue: 'emailaddress'
                    },{
                        title: 'Web Site',
                        field: 'doc._source.hasFeatureCollection.website_feature.website',
                        featureArray: 'doc._source.hasFeatureCollection.website_feature',
                        featureValue: 'website'
                    },{
                        title: 'Credit Cards',
                        field: 'doc._source.hasFeatureCollection.creditcardaccepted_feature.creditcardaccepted',
                        featureArray: 'doc._source.hasFeatureCollection.creditcardaccepted_feature',
                        featureValue: 'creditcardaccepted'
                    }]
                },
                "2": {
                    classes: 'listing-details',
                    fields: [{
                        title: 'Name',
                        field: 'doc._source.hasFeatureCollection.person_name_feature.person_name'
                    },{
                        title: 'Alias',
                        field: "doc['_source']['hasFeatureCollection']['person_alias_feature ']['person_alias']",
                        featureArray: "doc['_source']['hasFeatureCollection']['person_alias_feature ']",
                        featureValue: 'person_alias',
                        hideIfMissing: true
                    },{
                        title: 'Age',
                        field: 'doc._source.hasFeatureCollection.person_age_feature.person_age',
                        featureArray: 'doc._source.hasFeatureCollection.person_age_feature',
                        featureValue: 'person_age'
                    },{
                        title: 'Ethnicity',
                        field: 'doc._source.hasFeatureCollection.person_ethnicity_feature.person_ethnicity',
                        featureArray: 'doc._source.hasFeatureCollection.person_ethnicity_feature',
                        featureValue: 'person_ethnicity'
                    },{
                        title: 'Hair Color',
                        field: 'doc._source.hasFeatureCollection.person_haircolor_feature.person_haircolor',
                        featureArray: 'doc._source.hasFeatureCollection.person_haircolor_feature',
                        featureValue: 'person_haircolor'
                    },{
                        title: 'Height',
                        field: 'doc._source.hasFeatureCollection.person_height_feature.person_height',
                        featureArray: 'doc._source.hasFeatureCollection.person_height_feature',
                        featureValue: 'person_height'
                    },{
                        title: 'Weight',
                        field: "doc['_source']['hasFeatureCollection']['person_weight_feature ']['person_weight']",
                        featureArray: "doc['_source']['hasFeatureCollection']['person_weight_feature ']",
                        featureValue: 'person_weight'
                    },{
                        title: 'Eye Color',
                        field: 'doc._source.hasFeatureCollection.person_eyecolor_feature.person_eyecolor',
                        hideIfMissing: true
                    },{
                        title: 'Hair Type',
                        field: 'doc._source.hasFeatureCollection.person_hairtype_feature.person_hairtype',
                        featureArray: 'doc._source.hasFeatureCollection.person_hairtype_feature',
                        featureValue: 'person_hairtype',
                        hideIfMissing: true
                    },{
                        title: 'Hair Length',
                        field: 'doc._source.hasFeatureCollection.person_hairlength_feature.person_hairlength',
                        featureArray: 'doc._source.hasFeatureCollection.person_hairlength_feature',
                        featureValue: 'person_hairlength',
                        hideIfMissing: true
                    },{
                        title: 'Gender',
                        field: 'doc._source.hasFeatureCollection.person_gender_feature.person_gender',
                        featureArray: 'doc._source.hasFeatureCollection.person_gender_feature',
                        featureValue: 'person_gender',
                        hideIfMissing: true
                    },{
                        title: 'Piercings',
                        field: 'doc._source.hasFeatureCollection.person_piercings_feature.person_piercings',
                        featureArray: 'doc._source.hasFeatureCollection.person_piercings_feature',
                        featureValue: 'person_piercings',
                        hideIfMissing: true
                    },{
                        title: 'Tattoos',
                        field: 'doc._source.hasFeatureCollection.person_tattoocount_feature.person_tattoocount',
                        featureArray: 'doc._source.hasFeatureCollection.person_tattoocount_feature',
                        featureValue: 'person_tattoocount',
                        hideIfMissing: true
                    },{
                        title: 'Rate(s)',
                        field: 'doc._source.hasFeatureCollection.rate_feature.rate',
                        featureArray: 'doc._source.hasFeatureCollection.rate_feature',
                        featureValue: 'rate_feature',
                        hideIfMissing: true
                    },{
                        title: 'Hips Type',
                        field: 'doc._source.hasFeatureCollection.person_hipstype_feature.person_hipstype',
                        featureArray: 'doc._source.hasFeatureCollection.person_hipstype_feature',
                        featureValue: 'person_hipstype',
                        hideIfMissing: true
                    },{
                        title: 'Cup Size',
                        field: 'doc._source.hasFeatureCollection.person_cupsizeus_feature.person_cupsizeus',
                        featureArray: 'doc._source.hasFeatureCollection.person_cupsizeus_feature',
                        featureValue: 'person_cupsizeus',
                        hideIfMissing: true
                    },{
                        title: 'Waist Size',
                        field: "doc['_source']['hasFeatureCollection']['person_waistsize_feature ']['person_waistsize']",
                        featureArray: "doc['_source']['hasFeatureCollection']['person_waistsize_feature ']",
                        featureValue: 'person_waistsize',
                        hideIfMissing: true
                    },{
                        title: 'Bust Band Size',
                        field: 'doc._source.hasFeatureCollection.person_bustbandsize_feature.person_bustbandsize',
                        featureArray: 'doc._source.hasFeatureCollection.person_bustbandsize_feature',
                        featureValue: 'person_bustbandsize',
                        hideIfMissing: true
                    },{
                        title: 'Grooming',
                        field: 'doc._source.hasFeatureCollection.person_grooming_feature.person_grooming',
                        featureArray: 'doc._source.hasFeatureCollection.person_grooming_feature',
                        featureValue: 'person_grooming',
                        hideIfMissing: true
                    },{
                        title: 'Build',
                        field: 'doc._source.hasFeatureCollection.person_build_feature.person_build',
                        featureArray: 'doc._source.hasFeatureCollection.person_build_feature',
                        featureValue: 'person_build',
                        hideIfMissing: true
                    },{
                        title: 'Implants',
                        field: "doc['_source']['hasFeatureCollection']['person_implantspresent_feature ']['person_implantspresent']",
                        featureArray: "doc['_source']['hasFeatureCollection']['person_implantspresent_feature ']",
                        featureValue: 'person_implantspresent',
                        hideIfMissing: true
                    },{
                        title: 'In Call/Out Call',
                        field: 'doc._source.hasFeatureCollection.person_incalloutcall_feature.person_incalloutcall',
                        featureArray: 'doc._source.hasFeatureCollection.person_incalloutcall_feature',
                        featureValue: 'person_incalloutcall',
                        hideIfMissing: true
                    },{
                        title: 'Username',
                        field: 'doc._source.hasFeatureCollection.person_username_feature.person_username',
                        featureArray: 'doc._source.hasFeatureCollection.person_username_feature',
                        featureValue: 'person_username',
                        hideIfMissing: true
                    },{
                        title: 'Travel',
                        field: "doc['_source']['hasFeatureCollection']['person_travel_feature ']['person_travel']",
                        featureArray: "doc['_source']['hasFeatureCollection']['person_travel_feature ']",
                        featureValue: 'person_travel',
                        hideIfMissing: true
                    },{
                        title: 'Provider',
                        field: 'doc._source.hasFeatureCollection.provider_name_feature.provider_name',
                        featureArray: 'doc._source.hasFeatureCollection.provider_name_feature',
                        featureValue: 'provider_name'
                    }]
                },
                "3": {
                    classes: "",
                    fields: [{
                        field: 'doc.highlight["hasBodyPart.text"][0] || doc._source.hasBodyPart.text',
                        hideIfMissing: true
                    }]
                }
            },
            imageField: 'hasImagePart.cacheUrl'
        },
        'dig-mrs-latest': {
            facets: {
                euiFilters: [],
                //simFilter: {},
                aggFilters: [{
                    title: 'Author',
                    type: 'eui-aggregation',
                    field: 'author_agg',
                    terms: 'hasFeatureCollection.author_feature.author',
                    count: 20
                },{
                    title: 'Year',
                    type: 'eui-aggregation',
                    field: 'year_agg',
                    terms: 'hasFeatureCollection.publication_year_feature.publication_year',
                    count: 20
                },{
                    title: 'Affiliation',
                    type: 'eui-aggregation',
                    field: 'affiliation_agg',
                    terms: 'hasFeatureCollection.affiliation_country_feature.affiliation_country',
                    count: 20
                },{
                    title: 'Compound',
                    type: 'eui-aggregation',
                    field: 'compound_agg',
                    terms: 'hasFeatureCollection.compound_feature.compound',
                    count: 20
                }]
            },

            listFields: {
                title: [{
                    title: 'Title',
                    type: 'title',
                    field: 'doc._source.hasTitlePart.text',
                    section: 'title'
                }],
                short: [{
                    title: 'Date',
                    field: "doc._source.dateCreated | date:'MM/dd/yyyy HH:mm:ss UTC'",
                    classes: 'date'
                },{
                    title: 'Author',
                    field: 'doc._source.hasFeatureCollection.author_feature.author || doc._source.hasFeatureCollection.author_feature[0].author',
                    classes: 'location'
                },{
                    title: 'Affiliation',
                    field: 'doc._source.hasFeatureCollection.affiliation_country_feature.affiliation_country || doc._source.hasFeatureCollection.affiliation_country_feature[0].affiliation_country',
                    classes: 'location'
                }],
                full: {
                    "1": {
                        classes: 'listing-details',
                        fields: [{
                            title: 'Authors(s)',
                            field: 'doc._source.hasFeatureCollection.author_feature.author',
                            featureArray: 'doc._source.hasFeatureCollection.author_feature',
                            featureValue: 'author'
                        },{
                            title: 'Affiliation',
                            field: 'doc._source.hasFeatureCollection.affiliation_country_feature.affiliation_country',
                            featureArray: 'doc._source.hasFeatureCollection.affiliation_country_feature',
                            featureValue: 'affiliation_country'
                        },{
                            title: 'Compound(s)',
                            field: 'doc._source.hasFeatureCollection.compound_feature.compound',
                            featureArray: 'doc._source.hasFeatureCollection.compound_feature',
                            featureValue: 'compound'
                        },{
                            title: 'Abstract',
                            field: "doc['_source']['hasAbstractPart']['text']"
                        },{
                            title: 'Date',
                            field: "doc._source.dateCreated | date:'MM/dd/yyyy HH:mm:ss UTC'"
                        }]
                    }
                }
            },

            detailFields: {
                "1": {
                    classes: 'listing-details',
                    fields: [{
                        title: 'Date',
                        field: "doc._source.dateCreated | date:'MM/dd/yyyy HH:mm:ss UTC'",
                        classes: 'date'
                    },{
                        title: 'Authors(s)',
                        field: 'doc._source.hasFeatureCollection.author_feature.author',
                        featureArray: 'doc._source.hasFeatureCollection.author_feature',
                        featureValue: 'author'
                    },{
                        title: 'Affiliation',
                        field: 'doc._source.hasFeatureCollection.affiliation_country_feature.affiliation_country',
                        featureArray: 'doc._source.hasFeatureCollection.affiliation_country_feature',
                        featureValue: 'affiliation_country'
                    },{
                        title: 'Compound(s)',
                        field: 'doc._source.hasFeatureCollection.compound_feature.compound',
                        featureArray: 'doc._source.hasFeatureCollection.compound_feature',
                        featureValue: 'compound'
                    },{
                        title: 'Abstract',
                        field: "doc['_source']['hasAbstractPart']['text']"
                    }]
                }
            }
        }
    }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
