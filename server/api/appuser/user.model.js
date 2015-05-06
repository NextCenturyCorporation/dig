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
        }
    }, 
    {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Query)
            }
        }
    });

    return User;
};