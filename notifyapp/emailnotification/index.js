/* DIG email notification */

'use strict';

var SendGrid   = require('sendgrid');

module.exports = function NotificationEmail (fromAddr, digUrl, smtpHost, smtpUser, smtpPass) {
    this.fromAddr = fromAddr;
    this.digUrl = digUrl;
    this.smtpHost = smtpHost;
    this.smtpUser = smtpUser;
    this.smtpPass = smtpPass;

    // create new sendgrid object that knows how to connect to the SendGrid remote service API
    var sendgrid = new SendGrid(this.smtpUser, this.smtpPass);

    // send the following message with sendgrid client.  SendGrid will call callback
    // function with two parameters: error (a string) and message (json object).
    this.send = function (user, query, cb) {
        sendgrid.send({
            to: user.emailAddress,
            from: this.fromAddr,
            subject: 'DIG Notification: ' + query.name,
            text: 'There are new results available for the DIG saved query ' + 
            query.name + '.\n' +
            'Notification results can be accessed in the DIG application here: ' + digUrl
        }, cb);
    };
};
