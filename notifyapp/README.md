# notifyapp

This application periodically runs DIG saved scheduled queries (SSQs) to see if new notifications need to be created to alert DIG users that new data is available for their
SSQs.

# environment variables
           Name         | Description
----------------------- | -----------------------------------------------------
ES_USER                 | elasticsearch user name (no default)
ES_PASS                 | elasticsearch password (no default)
EUI_SERVER              | elasticsearch server name(default is 'localhost')
EUI_SERVER_PORT         | elasticsearch server port (default is 9200)
EUI_SERVER_PROTO        | protocol (default is 'http')
EUI_SEARCH_INDEX        | elasticsearch index name (default 'mockads')
EUI_SEARCH_TYPE         | elasticsearch type name (default is 'ad')
DIG_URL                 | url used in DIG email notification
SMTP_USER               | user name credential for connecting to SMTP server
SMTP_PASS               | password credential for connecting to SMTP server
SMTP_HOST               | hostname of SMTP server (default 'smtp.sendgrid.net')
EMAIL_FROM              | email sender address


