This is a mock implementation of the API that ISI uses for the image sim query feature.  


I have created a mock of the API for image similarity here:

http://vinisvr:3001/imagesim

It returns after a 5 second delay.  It can be called with any query string:

http://vinisvr:3001/imagesim?foo=bar

The elasticsearch dataset is updated to include the similar images attribute for ten ads.  So no matter what image is selected, the data will always return the same ten ad results.  The way to call this is:

curl -XGET 'vinisvr:9200/dig/WebPage/_search' -d '
{
    "query" : {
        "filtered" : {
            "filter" : {
                "term" : {
                    "hasFeatureCollection.similar_images_feature.featureValue": "https://vinisvr/images/test.jpg"
                }
            }
        }
    }
}'

(warning -- cut and paste from outlook email often has issues)

The way to use this API is in two steps:

Step 1:
GET http://vinisvr:3001/imagesim?uri=https://vinisvr/images/test.jpg
(wait for return 200 OK)

Step 2:
Then pursue the results with a query like the one above that searches for all ads that contain images similar to https://vinisvr/images/test.jpg​

To integrate, we will have to call the real API, and pass the real image URI to the real ElasticSearch instance.
