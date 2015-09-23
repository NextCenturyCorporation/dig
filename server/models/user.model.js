'use strict';

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', 
    {
        username: {
            type: DataTypes.STRING, 
            primaryKey: true,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('user', 'admin', 'disabled', 'guest'),
            defaultValue: 'user'
        },
        emailAddress: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            }
        },
        sendEmailNotification: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            validate: {
                ifNotificationsThenEmail: function() {
                    if(this.sendEmailNotification && (this.emailAddress === undefined || this.emailAddress === null)) {
                        throw new Error('Require emailAddress if sendEmailNotification is true.');
                    }
                }
            }
        },
        blurImagesEnabled: {
            type: DataTypes.BOOLEAN
        },
        blurImagesPercentage: {
            type: DataTypes.DECIMAL
        }
    }, 
    {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Query, {onDelete: 'CASCADE'});
            }
        }

    });

    return User;
};