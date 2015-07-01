'use strict';

angular.module('digApp.services')
.service('textHighlightService', function($sce) {
    var svc = this;

    /*
     * Function to find highlighted text matches. May potentially have poor performance if 
     * highlightedText array is very large.
     *
     * Background: When elasticsearch highlighting is enabled, highlighted text is returned 
     * in a seperate highlight object (as opposed to doc.source).
     * 
     * If the elasticsearch field with highlighting enabled is part of an array and 
     * a match is found within that array, elasticsearch won't indicate where 
     * the match appeared in the initial array -- it only returns matches.
     *
     * i.e. highlighting the text matching 'ten' on the following:
     * 
     * 'value': ['one', 'two', 'ten', 'five'] 
     * 
     * will result in:
     * 
     * doc.highlight: 'value' :['<mark>ten<mark>']
     * 
     * and not an array index reference for the inital array.
     *  
     */
    svc.highlightCheck = function(field, highlightedText) {
        if(!field) {
            return field;
        } else if(highlightedText) {
            for(var i = 0; i < highlightedText.length; i++) {
                // strip all html tags from both fields to do comparison
                var stripTagsHighlightItem = String(highlightedText[i]).replace(/<[^>]+>/gm, '');
                var stripTagsField =  String(field).replace(/<[^>]+>/gm, '');
                
                if(stripTagsHighlightItem === stripTagsField) {
                    // return item from array with all html tags except tags used for highlighting striped out
                    return $sce.trustAsHtml(String(highlightedText[i]).replace(/<(?!\/?mark\s*\/?)[^>]+>/gm, ''));
                }
            }   
        }

        // no match in array -- return field with all html tags except tags used for highlighting striped out
        return $sce.trustAsHtml(String(field).replace(/<(?!\/?mark\s*\/?)[^>]+>/gm, ''));
    };

});