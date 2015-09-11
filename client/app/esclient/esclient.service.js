'use strict';

angular.module('digApp')
.service('esclient', function(esFactory, euiServer, euiPort) {

    return esFactory({
        host: {
            host: euiServer,
            port: euiPort,
            protocol: 'http' // TODO: should this be config value?
        },
        apiVersion: '1.3',
        log: 'warning'
    });
});