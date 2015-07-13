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
                User.hasMany(models.Folder, {onDelete: 'CASCADE'});
            }
        }
    });

    return User;
};