/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var config = require('./config/environment');

module.exports = function(app) {
    // Insert routes below
    app.use('/api/things', require('./api/thing'));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

    app.get('/config/?', function(req, res) {
        var configResponse = {
            euiHost: config.euiServerUrl,
            euiPort: config.euiServerPort,
            euiSearchIndex: config.euiSearchIndex,
            euiConfigs: config.euiConfigs[config.euiSearchIndex],
            simHost: config.imageSimUrl,
            simPort: config.imageSimPort,
            blurImagesEnabled: config.blurImages,
            blurImagesPercentage: config.blurPercentage,
            pixelateImagesPercentage: config.pixelatePercentage,
            includeMissingDefault: config.includeMissingAggregationsDefault,
            appVersion: config.appVersion
        };

        res.status(200).send(configResponse);
    });

    // All other routes should redirect to the index.html
    app.route('/*')
    .get(function(req, res) {
        res.sendfile(app.get('appPath') + '/index.html');
    });
};
