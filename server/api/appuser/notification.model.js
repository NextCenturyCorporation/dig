"use strict";
/*
 * A Notification is used to notify a user that their scheduled saved query
 * (SSQ) has new results.  The single field hasRun will be initialized to
 * false. When a user runs an SSQ that has a notification, the hasRun is set
 * to true.  The effect is the same as when a user reads an unread email.
 */
module.exports = function(sequelize, DataTypes) {
    var Notification = sequelize.define("Notification", {
        hasRun: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, 
    {
        classMethods: {
            associate: function(models) {
                Notification.belongsTo(models.Query, {onDelete: 'CASCADE'});
            }
        }
    });

    return Notification;
};