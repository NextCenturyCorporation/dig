'use strict';

module.exports = function(sequelize, DataTypes) {
    var Folder = sequelize.define('Folder', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'compositeIndex'
        },
        UserUsername: {
            type: DataTypes.STRING,
            unique: 'compositeIndex'
        },
        parentId: {
            type: DataTypes.INTEGER,
            unique: 'compositeIndex'
        }
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