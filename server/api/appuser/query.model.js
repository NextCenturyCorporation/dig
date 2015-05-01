"use strict";

module.exports = function(sequelize, DataTypes) {
    var Query = sequelize.define("Query", {
        title: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Query.belongsTo(models.User);
            }
        }
    });

    return Query;
};