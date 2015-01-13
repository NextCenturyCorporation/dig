'use strict';

var path = require('path');
var _ = require('lodash');

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
    userRoles: ['guest', 'user', 'admin'],

    // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },

    euiServerUrl: process.env.EUI_SERVER_URL || 'http://localhost',
    euiServerPort: process.env.EUI_SERVER_PORT || 9200,
    euiSearchIndex: process.env.EUI_SEARCH_INDEX || 'dig',

    imageSimUrl: process.env.IMAGE_SIM_URL || 'http://localhost',
    imageSimPort: process.env.IMAGE_SIM_PORT || 3001,

    blurImages: ((!!process.env.BLUR_IMAGES && process.env.BLUR_IMAGES === 'false') ? false : true),

    blurPercentage: process.env.BLUR_PERCENT || 5,

    euiConfigs: {
        'dig': {
            facets: {
                euiFilters :[{
                    title: 'Phone',
                    type: 'eui-filter',
                    field: 'phonenumber',
                    terms: 'phone',
                }],
                simFilters: [{
                    title: 'Image',
                    type: 'simFilter',
                    field: 'hasFeatureCollection.similar_images_feature.featurevalue'
                }],
                aggFilters: [{
                    title: 'City/Region',
                    type: 'eui-aggregation',
                    field: 'city_agg',
                    terms: 'hasFeatureCollection.place_postalAddress_feature.featureObject.addressLocality',
                    count: 30
                },{
                    title: 'Ethnicity',
                    type: 'eui-aggregation',
                    field: 'etn_agg',
                    terms: 'person_ethnicity',
                    count: 20
                },{
                    title: 'Hair Color',
                    type: 'eui-aggregation',
                    field: 'hc_agg',
                    terms: 'person_haircolor',
                    count: 10
                },{
                    title: 'Age',
                    type: 'eui-aggregation',
                    field: 'age_agg',
                    terms: 'person_age',
                    count: 10
                }]
            },

            listFields: {
                "title": [{
                    title: 'Title',
                    type: 'title',
                    field: 'doc._source.hasTitlePart.text',
                    section: 'title'
                }],
                "short": [{
                    title: 'Date',
                    field: "doc._source.dateCreated | date:'MM/dd/yyyy HH:mm:ss'",
                    classes: 'date'
                },{
                    title: 'Location',
                    field: 'doc._source.hasFeatureCollection.place_postalAddress_feature.featureObject.addressLocality',
                    classes: 'location'
                },{
                    title: 'Phone',
                    field: 'doc._source.hasFeatureCollection.phonenumber_feature.phonenumber || doc._source.hasFeatureCollection.phonenumber_feature[0].phonenumber',
                    classes: 'phone'
                },{
                    title: 'Name',
                    field: 'doc._source.hasFeatureCollection.person_name_feature.person_name',
                    classes: 'age'
                },{
                    title: 'Age',
                    field: 'doc._source.hasFeatureCollection.person_age_feature.person_age',
                    classes: 'age'
                }],
                "full": {
                    "listing-details": {
                        classes: 'listing-details',
                        fields: [{
                            title: 'Name(s)',
                            field: 'doc._source.hasFeatureCollection.person_name_feature.person_name',
                        },{
                            title: 'City',
                            field: 'doc._source.hasFeatureCollection.place_postalAddress_feature.featureObject.addressLocality',
                        },{
                            title: 'Phone Number',
                            field: 'doc._source.hasFeatureCollection.phonenumber_feature.phonenumber',
                            featureArray: 'doc._source.hasFeatureCollection.phonenumber_feature',
                            featureValue: 'phonenumber'
                        },{
                            title: 'Email',
                            field: 'doc._source.hasFeatureCollection.emailaddress_feature.emailaddress',
                        },{
                            title: 'Web Site',
                            field: 'doc._source.hasFeatureCollection.website_feature.website',
                        }]
                    },
                    "person-details": {
                        classes: 'person-details',
                        fields: [{
                            title: 'Age',
                            field: 'doc._source.hasFeatureCollection.person_age_feature.person_age',
                        },{
                            title: 'Ethnicity',
                            field: 'doc._source.hasFeatureCollection.person_ethnicity_feature.person_ethnicity',
                            featureArray: 'doc._source.hasFeatureCollection.person_ethnicity_feature',
                            featureValue: 'person_ethnicity'
                        },{
                            title: 'Hair Color',
                            field: 'doc._source.hasFeatureCollection.person_haircolor_feature.person_haircolor',
                        },{
                            title: 'Height',
                            field: 'doc._source.hasFeatureCollection.person_height_feature.person_height',
                        },{
                            title: 'Weight',
                            field: "doc['_source']['hasFeatureCollection']['person_weight_feature ']['person_weight']",
                        }]
                    }
                }
            },

            detailFields: [{

            }]
        }
    }

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});