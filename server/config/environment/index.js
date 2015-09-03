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
       'dig-atf-weapons-latest':{
            facets: {
                euiFilters: [],
                //simFilter: {},
                aggFilters: [{
                    title: 'Type',
                    type: 'eui-aggregation',
                    field: 'type_agg',
                    terms: 'a',
                    termsType: 'string',
                    count: 5
                },{
                    title: 'Publisher',
                    type: 'eui-aggregation',
                    field: 'publisher_agg',
                    terms: 'publisher.name',
                    termsType: 'string',
                    count: 10
                },{
                    title: 'Non-English',
                    type: 'eui-aggregation',
                    field: 'non_eng_agg',
                    terms: 'hasNonEnglishPhrase.hasPhrase.name',
                    termsType: 'string',
                    count: 10
                },{
                    title: 'Gang Terms',
                    type: 'eui-aggregation',
                    field: 'gang_terms_agg',
                    terms: 'hasGangPhrase.hasPhrase.name',
                    termsType: 'string',
                    count: 10
                },{
                    title: 'Technology',
                    type: 'eui-aggregation',
                    field: 'tech_agg',
                    terms: 'hasTechnologyPhrase.hasPhrase.name',
                    termsType: 'string',
                    count: 10
                },{
                    title: 'NFA',
                    type: 'eui-aggregation',
                    field: 'nfa_agg',
                    terms: 'hasNFAPhrase.hasPhrase.name',
                    termsType: 'string',
                    count: 10
                },{
                    title: 'Firearms',
                    type: 'eui-aggregation',
                    field: 'firearms_agg',
                    terms: 'hasFirearmsPhrase.hasPhrase.name',
                    termsType: 'string',
                    count: 10
                },{
                    title: 'Author Names',
                    type: 'eui-aggregation',
                    field: 'authors_agg',
                    terms: 'hasPost.author.name',//'author_name_histogram.value',
                    termsType: 'string',
                    count: 10
                },{
                    title: 'Seller',
                    type: 'eui-aggregation',
                    field: 'seller_agg',
                    terms: 'seller.description.raw',
                    termsType: 'string',
                    count: 10
                },{
                    title: 'Buyer',
                    type: 'eui-aggregation',
                    field: 'buyer_agg',
                    terms: 'buyer.description.raw',
                    termsType: 'string',
                    count: 10
                },{
                    title: 'Location',
                    type: 'eui-aggregation',
                    field: 'locations_agg',
                    terms: 'availableAtOrFrom.address.name',
                    termsType: 'string',
                    count: 10
                }]
            },
            highlight: {
                fields: [
                    '*'
                ]
            },
            debugFields: {
                fields: ['doc._id']
            },
/*            dateHistogram: {
                field: 'hasPost.dateCreated'
            },*/
            offerFields: {
                title: [{
                    title: 'Title',
                    type: 'title',
                    field: 'doc.highlight["title"][0] || doc._source.title || doc.highlight["name"][0] || doc._source.name',
                    section: 'title'
                }],
                short: [{
                    title: 'Date',
                    field: "doc._source.availabilityStarts | date:'MM/dd/yyyy HH:mm:ss UTC'",
                    classes: 'date'
                },{
                    title: 'At or From',
                    field: 'doc._source.availableAtOrFrom.address.name || doc._source.availableAtOrFrom[0].address.name',
                    classes: 'name'
                },{
                    title: 'Publisher',
                    field: 'doc._source.publisher.name || doc._source.publisher[0].name',
                    classes: 'publisher'
                }],
                full: {
                    "1": {
                        classes: 'offer-details',
                        fields: [{
                            title: 'Buyer',
                            field: 'doc.highlight["buyer.description"][0] || doc._source.buyer.description',
                            hideIfMissing: true
                        },{
                            title: 'Seller',
                            field: 'doc.highlight["seller.description"][0] || doc._source.seller.description',
                            hideIfMissing: true
                        },{
                            title: 'Price',
                            field: 'doc._source.price',
                            hideIfMissing: true
                        },{
                            title: 'Currency Type',
                            field: 'doc._source.priceCurrency',
                            hideIfMissing: true
                        },{
                            title: 'Price Specification',
                            field: 'doc._source.priceSpecification',
                            featureArray: 'doc._source.priceSpecification',
                            featureValues: ['price', 'priceCurrency'],
                            hideIfMissing: true
                        },{
                            title: 'Date',
                            field: "doc._source.availabilityStarts | date:'MM/dd/yyyy HH:mm:ss UTC'"
                        },{
                            title: 'At or From',
                            field: 'doc._source.availableAtOrFrom.address.name'
                        }]
                    },
                    "2": {
                        classes: 'more-details',
                        fields: [{
                            title: 'Category',
                            field: 'doc._source.itemOffered.category'
                        },{
                            title: 'Keywords',
                            featureArray: 'doc._source.itemOffered.keywords',
                            highlightArray: 'doc.highlight["itemOffered.keywords"]'
                        },{
                            title: 'Publisher',
                            field: 'doc._source.publisher.name'
                        }]
                    }
                },
                body: {
                    fields: [{
                        title: 'Description',
                        field: 'doc.highlight["description"][0] || doc._source.description'
                    }]
                }

            },
            personFields: {
                title: [{
                    title: 'Title',
                    type: 'title',
                    field: 'doc.highlight["name"][0] || doc._source.name',
                    section: 'title'
                }],
                short: [{
                    title: 'Location',
                    field: 'doc._source.location.address.name',
                    classes: 'location'
                },{
                    title: 'Member Of',
                    field: 'doc._source.memberOf.memberOf.name || doc._source.memberOf[0].memberOf.name',
                    classes: 'name'
                }],
                full: {
                    "1": {
                        classes: 'person-details',
                        fields: [{
                            title: 'Location',
                            field: 'doc._source.location.address.name'
                        },{
                            title: 'Member Of',
                            field: 'doc._source.memberOf.memberOf.name || doc._source.memberOf[0].memberOf.name'
                        },{
                            title: 'Start Date',
                            field: "(doc._source.memberOf.startDate || doc._source.memberOf[0].startDate) | date:'MM/yyyy UTC'"
                        },{
                            title: 'Identifier',
                            field: 'doc._source.identifier.name'
                        }]
                    }
                }
            },
            threadFields: {
                title: [{
                    title: 'Title',
                    type: 'title',
                    field: 'doc.highlight["hasTitlePart.text"][0] || doc._source.hasTitlePart.text || doc._source.hasTitlePart[0].text',
                    section: 'title'
                }],
                short: [{
                    title: 'Dates Created',
                    field: "doc._source.dateCreated_aggregated.value | date:'MM/dd/yyyy HH:mm:ss UTC'",
                    classes: 'date'
                },{
                    title: 'Publisher',
                    field: 'doc._source.publisher.name',
                    classes: 'publisher'
                }],
                full: {
                    "1": {
                        classes: 'thread-details',
                        fields: [{
                            title: 'Dates Created',
                            field: 'doc._source.dateCreated_aggregated.value'
                        },{
                            title: 'Author Name',
                            featureAggregation: 'doc._source.author_name_histogram',
                            aggName: 'value',
                            aggCount: 'count' 
                        },{
                            title: 'Publisher',
                            field: 'doc._source.publisher.name'
                        }]
                    }
                },
                postFields: {
                    field: 'doc._source.hasPost',
                    subject: [{
                        title: 'Title',
                        type: 'title',
                        field: 'hasTitlePart.text || hasTitlePart[0].text',
                        highlightArray: 'doc.highlight["hasPost.hasTitlePart.text"]',
                        section: 'title'
                    }],
                    short: [{
                        title: 'Date',
                        field: "dateCreated | date:'MM/dd/yyyy HH:mm:ss UTC'",
                        highlightArray: 'doc.highlight["hasPost.dateCreated"]',
                        classes: 'date'
                    },{
                        title: 'Author Name',
                        field: 'author.name',
                        highlightArray: 'doc.highlight["hasPost.author.name"]',
                        classes: 'author'
                    },{
                        title: 'Author Identifier',
                        field: 'author.identifier.name',
                        highlightArray: 'doc.highlight["hasPost.author.identifier.name"]',
                        classes: 'author'

                    }],
                    body: {
                        title: 'Body',
                        field: 'hasBodyPart.text',
                        highlightArray: 'doc.highlight["hasPost.hasBodyPart.text"]'
                    },
                    signature: {
                        title: 'Signature',
                        field: 'hasSignaturePart.text',
                        highlightArray: 'doc.highlight["hasPost.hasSignaturePart.text"]',
                    }
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
