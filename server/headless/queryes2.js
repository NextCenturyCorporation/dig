var elasticsearch = require('elasticsearch');
var ejs = require('elastic.js');

var req4 = 
{
    "fields": ["_timestamp"],
    "query": {
        "match":{
            "title":{
                "query":"whale"
            }
        }
    },
    "sort": {
        "_timestamp": {"order": "desc"}
    },
    "size":1
};

var client = new elasticsearch.Client({
    host:'localhost:9200', log:'trace'});

var results = {};
client.search({
    index: 'mockads',
    type: 'ad',
    body: req4
}).then(function (resp) {
    console.log("HITS:");
    console.log(resp.hits.total);
    results = resp;
    //process.exit(code=0);
    return;
}, function (err) {
    console.trace(err.message);
});


