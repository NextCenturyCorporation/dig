var elasticsearch = require('elasticsearch');
var ejs = require('elastic.js');


var req = 
ejs.Request()
    .query(ejs.MatchQuery('_all', 'whale'))
    .filter(ejs.TermFilter('ethnicity','cuban'));

var req2 =
ejs.Request()
    .query(ejs.FilteredQuery(
        ejs.MatchQuery('_all', 'whale'),
        ejs.TermFilter('ethnicity', 'cuban')));

var req3 = 
{
  "query": {
    "filtered": {
      "query": {
        "match":{
          "title":{
            "query":"whale"
          }
        }
      },
      "filter":{
        "bool":{
          "must":
          [{"terms":{"username":["agardner3d5"]}},
          {"terms":{"city":["Bakersfield"]}},
          {"range": {"_timestamp": {"lt": "now-1h"}}}
          ]
        }
      }
    }
  }
};

var req4 = 
{
  "query": {
    "match":{
      "title":{
        "query":"whale"
      }
    }
  },
  "filter":{
    "bool":{
      "must":
      [{"terms":{"username":["agardner3d5"]}},
      {"terms":{"city":["Bakersfield"]}}]
    }
  }
};

var client = new elasticsearch.Client({
    host:'localhost:9200', log:'trace'});

client.search({
  index: 'mockads',
  type: 'ad',
  body: req3
}).then(function (resp) {
  console.log("HITS:");
  console.log(resp.hits.total);
  process.exit(code=0);
}, function (err) {
  console.trace(err.message);
});

// client.search({
//   index: 'mockads',
//   type: 'ad',
//   body: req2
// }).then(function (resp) {
//   console.log("HITS:");
//   console.log(resp.hits.total);
//   // process.exit(code=0);
// }, function (err) {
//   console.trace(err.message);
// });


