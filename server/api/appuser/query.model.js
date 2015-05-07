"use strict";

module.exports = function(sequelize, DataTypes) {
    var Query = sequelize.define("Query", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        digState: DataTypes.TEXT,
        elasticUIState: DataTypes.TEXT,
        lastRunDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        frequency: {
            type: DataTypes.ENUM('never', 'hourly', 'daily', 'weekly'),
            defaultValue: 'never',
            allowNull: false
        }
    }, 
    {
        classMethods: {
            associate: function(models) {
                Query.belongsTo(models.User, {onDelete: 'CASCADE'});
                Query.hasMany(models.Notification, {onDelete: 'CASCADE'});
            }
        },
    });

    return Query;
};