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
        'dig-patents-latest':{
            facets: {
                aggFilters: [{
                    title: 'Type',
                    type: 'eui-aggregation',
                    field: 'type_agg',
                    terms: '_type',
                    termsType: 'string',
                    count: 5
                },{                    
                    title: 'Owner',
                    type: 'eui-aggregation',
                    field: 'owner_agg',
                    nestedPath: 'currentAssignee.assignee',
                    terms: 'currentAssignee.assignee.name.raw',
                    termsType: 'string',
                    count: 10
                },{             
                    title: 'Court',
                    type: 'eui-aggregation',
                    field: 'court_agg',
                    nestedPath: 'legalAction.location',
                    terms: 'legalAction.location.name.raw',
                    termsType: 'string',
                    count: 10
                },{                    
                    title: '# Legal Actions',
                    type: 'eui-aggregation',
                    field: 'num_legal_act_agg',
                    terms: 'legalActionCount',
                    termsType: 'number',
                    count: 10
                },{                    
                    title: '# Defendants',
                    type: 'eui-aggregation',
                    field: 'num_defendant_agg',
                    terms: 'defendantCount',
                    termsType: 'number',
                    count: 10
                }],
                dateFilters: [{
                    startTitle: 'Legal Action After',
                    endTitle: 'Legal Action Before',
                    aggName: 'legal_act_date_agg',
                    nestedPath: 'legalAction',
                    field: 'legalAction.startTime'
                }],
                rangeFilters: [{
                    title: 'Defendant Count',
                    aggName: 'def_count_agg',
                    field: 'defendantCount'
                }]
            },
            highlight: {
                fields: [
                    '*'
                ]
            },
            search: {
                fields: [
                    '_all'
                ]
            },
            // also see postFields
            detailFields: {
                "1": {
                    classes: 'patent-details',
                    fields: [{
                        title: 'Identifier',
                        featureArray: 'doc._source.identifier',
                        featureValue: 'name',
                        field: 'doc._source.identifier.name'
                    },{
                        title: 'Agent',
                        featureArray: 'doc._source.agent',
                        featureValue: 'name',
                        field: 'doc._source.agent.name'
                    },{
                        title: 'Date Published',
                        field: 'doc._source.datePublished'
                    }]
                }, 
                "2": {
                    classes: 'more-patent-details',
                    fields: [{
                        title: 'Applicant',
                        featureArray: 'doc._source.applicant',
                        featureValue: 'name',
                        field: 'doc._source.applicant.name'
                    }]
                },
                "3":{
                    classes: 'citation-list',
                    fields: [{
                        title: 'Cited Patents',
                        featureArray: 'doc._source.citation',
                        featureValue: 'identifier.name',
                        field: 'doc._source.citation.identifier.name'
                    }]
                },
                "4":{
                    classes: 'body',
                    fields: [{
                        title: 'Text',
                        field: 'doc._source.hasClaimPart.text'
                    }]
                }
            },
            // this is for orgs
            offerFields: {
                title: [{
                    title: 'Title',
                    type: 'title',
                    field: 'doc._source.name || doc._source.name[0]',
                    section: 'title'
                }],
                short: [
                {
                    title: 'type',
                    field: 'doc._source.a',
                    classes: 'identifier'
                },{
                    title: 'patents',
                    field: 'doc._source.patentsAcquiredCount',
                    classes: 'number'
                },{
                    title: 'plaintiff',
                    field: 'doc._source.legalActionsAsPlaintiffCount',
                    classes: 'number'
                },{
                    title: 'defendant',
                    field: 'doc._source.legalActonsAsDefendantCount',
                    classes: 'number'
                },{
                    title: 'troll score',
                    field: 'doc._source.trolls.trollScore',
                    classes: 'number'
                }],
                full: {
                    "1": {
                        classes: 'operating-details',
                        fields: [{
                            title: 'Permit Issued By',
                            field: 'doc._source.operatingPermit.issuedBy.valueName',
                        },{
                            title: 'Permit Status',
                            field: 'doc._source.operatingPermit.status',
                        },{
                            title: 'Permit Valid From',
                            field: "doc._source.operatingPermit.validFrom | date:'MM/dd/yyyy HH:mm:ss UTC'"
                        },{
                            title: 'Permit Identifier',
                            field: 'doc._source.operatingPermit.validIn.identifier.name',
                        },{
                            title: 'Permit Valid In',
                            field: 'doc._source.operatingPermit.validIn.name',
                        }]
                    },
                    "2": {
                        classes: 'org-details',
                        fields: [{
                            title: 'Alternate Name(s)',
                            field: 'doc._source.alternateName || doc._source.alternateName[0]'
                        },{
                            title: 'Provider',
                            field: 'doc._source.providesService.provider',
                            featureArray: 'doc._source.providesService',
                            featureValue: 'provider'
                        },{
                            title: 'Provides Service',
                            field: 'doc._source.providesService.serviceType',
                            featureArray: 'doc._source.providesService',
                            featureValue: 'serviceType'
                        },{
                            title: 'Subtype',
                            field: 'doc._source.subtype'
                        }]
                    }
                }

            },
            // this is for patents
            threadFields: {
                title: [{
                    title: 'Title',
                    type: 'title',
                    field: 'doc._source.name',
                    section: 'title'
                }],
                short: [
                {
                    title: 'type',
                    field: 'doc._source.a',
                    classes: 'identifier'
                },
                {
                    title: 'owner',
                    field: 'doc._source.currentAssignee.assignee.name',
                    classes: 'identifier'
                },{
                    title: 'since',
                    field: 'doc._source.currentAssignee.startDate || doc._source.datePublished',
                    classes: 'identifier'
                },{
                    title: 'assignments',
                    field: 'doc._source.assignmentDates.length',
                    classes: 'identifier'
                },{
                    title: 'legal actions',
                    field: 'doc._source.legalActionCount',
                    classes: 'date'
                },{
                    title: 'id',
                    field: 'doc._source.identifier.name || doc._source.identifier[0].name',
                    classes: 'identifier'
                },{
                    title: 'defendants',
                    field: 'doc._source.defendantCount',
                    classes: 'number'
                }],
                full: {
                    "1": {
                        classes: 'patent-details',
                        fields: [{
                            title: 'Identifier',
                            featureArray: 'doc._source.identifier',
                            featureValue: 'name',
                            field: 'doc._source.identifier.name'
                        },{
                            title: 'Agent',
                            featureArray: 'doc._source.agent',
                            featureValue: 'name',
                            field: 'doc._source.agent.name'
                        },{
                            title: 'Date Published',
                            field: 'doc._source.datePublished'
                        }]
                    }, 
                    "2": {
                        classes: 'more-patent-details',
                        fields: [{
                            title: 'Applicant',
                            featureArray: 'doc._source.applicant',
                            featureValue: 'name',
                            field: 'doc._source.applicant.name'
                        }]
                    },
                    "3":{
                        classes: 'citation-list',
                        fields: [{
                            title: 'Cited Patents',
                            featureArray: 'doc._source.citation',
                            featureValue: 'identifier.name',
                            field: 'doc._source.citation.identifier.name'
                        }]
                    }
                },
                postFields: [{
                    title: 'Legal Actions',
                    field: 'doc._source.legalAction',
                    orderBy: '-startTime',
                    subject: [{
                        title: 'Title',
                        type: 'title',
                        field: 'name',
                        section: 'title'
                    }],
                    short: {
                        "1": [{
                            title: 'Filing Date',
                            field: 'startTime',
                            classes: 'date'
                        },{
                            title: 'Docket #',
                            field: 'identifier.name',
                            classes: 'identifier'
                        },{
                            title: 'Cause',
                            field: 'cause.name',
                            classes: 'cause'
                        },{
                            title: 'Location',
                            field: 'location.name',
                            classes: 'location'
                        }], 
                        "2": [{
                            title: 'Plaintiff',
                            field: 'plaintiff.name',
                            classes: 'plaintiff'
                        },{
                            title: 'Defendant',
                            field: 'defendant.name',
                            classes: 'defendant'
                        }]
                    }
                }]
            }
        }
    }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
