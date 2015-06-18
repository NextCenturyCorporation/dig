'use strict';

angular.module('digApp.services')
.service('utilService', function($sce) {
    var svc = this;

    svc.highlightCheck = function(field, highlightedText) {
        if(highlightedText) {
            for(var i = 0; i < highlightedText.length; i++) {
                var stripHighlightTags = String(highlightedText[i]).replace(/<[^>]+>/gm, '');
                if(stripHighlightTags === field) {
                    return $sce.trustAsHtml(String(highlightedText[i]).replace(/<(?!\/?mark\s*\/?)[^>]+>/gm, ''));
                }
            }   
        }

        return $sce.trustAsHtml(field);
    };

});