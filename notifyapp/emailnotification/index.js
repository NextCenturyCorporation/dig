/* DIG email notification */

'use strict';

var email = require('emailjs');

module.exports = function NotificationEmail (fromAddr, digUrl, smtpHost, smtpUser, smtpPass) {
    this.fromAddr = fromAddr;
    this.digUrl = digUrl;
    this.smtpHost = smtpHost;
    this.smtpUser = smtpUser;
    this.smtpPass = smtpPass;

    this.send = function (user, query, cb) {
        var server  = email.server.connect({
           user: this.smtpUser, 
           password: this.smtpPass, 
           host: this.smtpHost, 
           ssl: true
        });

        server.send({
            subject: 'DIG Notification: ' + query.name,
            text: 'There are new results available for the DIG saved query ' + 
            query.name + '.\n' +
            'Notification results can be accessed in the DIG application here: ' + digUrl,
            from: this.fromAddr,
            to: user.emailAddress
        }, cb);
    };
};
