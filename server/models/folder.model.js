'use strict';

module.exports = function(sequelize, DataTypes) {
    var Folder = sequelize.define('Folder', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    },
    {
        classMethods: {
            associate: function(models) {
                Folder.belongsTo(models.User, {onDelete: 'CASCADE'});
                Folder.hasMany(models.FolderItem, {onDelete: 'CASCADE'});
            }
        },
        hierarchy: {camelThrough: true}
    });

    return Folder;
};