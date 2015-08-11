'use strict';

module.exports = function(sequelize, DataTypes) {
    var FolderItem = sequelize.define('FolderItem', {
        elasticId: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, 
    {
        classMethods: {
            associate: function(models) {
                FolderItem.belongsTo(models.Folder, {onDelete: 'CASCADE'});
            }
        },
    });

    return FolderItem;
};