forever stopall
NODE_ENV='production' EUI_SERVER_URL='http://ec2-54-69-115-54.us-west-2.compute.amazonaws.com' EUI_SERVER_PORT='80' IMAGE_SIM_URL='http://ec2-54-69-115-54.us-west-2.compute.amazonaws.com' IMAGE_SIM_PORT='80' EUI_SEARCH_INDEX='dig-latest' BLUR_IMAGES=false forever server/app.js
