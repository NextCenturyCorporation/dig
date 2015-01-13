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
                facets: [{
                title: 'Phone',
                type: 'eui-filter',
                field: 'phonenumber',
                terms: 'phone',
                enabled: true
            },{
                title: 'Image',
                type: 'simFilter',
                field: 'hasFeatureCollection.similar_images_feature.featurevalue'
            },{
                title: 'City/Region',
                type: 'eui-aggregation',
                field: 'city_agg',
                terms: 'hasFeatureCollection.place_postalAddress_feature.featureObject.addressLocality'
            },{
                title: 'Ethnicity',
                type: 'eui-aggregation',
                field: 'etn_agg',
                terms: 'person_ethnicity'
            },{
                title: 'Hair Color',
                type: 'eui-aggregation',
                field: 'hc_agg',
                terms: 'person_haircolor'
            },{
                title: 'Age',
                type: 'eui-aggregation',
                field: 'age_agg',
                terms: 'person_age'
            }],

            listFields: [{
                title: 'Title',
                type: 'title',
                field: 'hasTitlePart.text',
                section: 'title'
            },{
                title: 'date',
                type: 'short',
                field: 'dateCreated',
                section: 'listing-details'
            },{
                title: 'Email',
                type: 'full',
                field: 'hasFeatureCollection.emailaddress_feature.emailaddress',
                section: 'listing-details'
            },{
                title: 'Age',
                type: 'short',
                field: 'hasFeatureCollection.emailaddress_feature.emailaddress',
                section: 'person-details'
            }],

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