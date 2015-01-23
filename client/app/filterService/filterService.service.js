'use strict';

angular.module('digApp.services')
.service('filterService', function(euiConfigs) {
    var me = this;

    var facets = euiConfigs.facets;
    var filterStates = {
        aggFilters: {},
        textFilters: {}
    };

    me.getFilterStates = function() {
        return filterStates;
    };

    me.getFacets = function() {
        return facets;
    };
});