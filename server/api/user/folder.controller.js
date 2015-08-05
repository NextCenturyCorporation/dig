'use strict';

var _ = require('lodash'),
    assert = require('assert'),
    models = require('../../models'),
    User = models.User,
    Folder = models.Folder,
    FolderItem = models.FolderItem,
    Sequelize = models.Sequelize;

function setUserName (req) {
    if (req.params.username === 'reqHeader') {
        req.params.username = req.headers.user;
    }
    return req.params.username;
}

function getUserInstance (req) {
    var name = setUserName(req);
    return User.findOrCreate({where: {username: name}})
}

var rootFolder = 
{
    name: 'ROOT',
    hierarchyLevel: 1,
    parentId: null
};

// Get list of folders for a specified duser.  If this user
// has no folders, create ROOT folder and return it
exports.index = function(req, res) {
    var user = {};
    getUserInstance(req)
    .spread(function(thisuser, created) {
        user = thisuser;
        return user.getFolders({include: [FolderItem]});
    })
    .then(function(folders) {
        if (folders.length > 0) {
            return res.status(200).json(folders);
        }
        else {
            user.createFolder(rootFolder)
            .then(function() {
                return user.getFolders({include: [FolderItem]});
            })
            .then(function(folders) {
                return res.status(200).json(folders);
            })
        }
    })
    .catch(function(err) {
        res.status(404).json(err);
    })  
};

// Get a single folder with it's items and children, recursively
exports.show = function(req, res) {
    var username = setUserName(req);

    Folder.find({
        where: {id: req.params.folderid, UserUsername: username},
        include: [FolderItem, {model: Folder, as: 'descendents', hierarchy: true}]
    })
    .then(function(folder) {
        assert.notEqual(folder, null, 'folder not found');
        res.status(200).json(folder);        
    }).catch(function(err) {
        res.status(404).json(err);
    });
};

// Creates one new persistent folder object
exports.create = function(req, res) {
    getUserInstance(req)
    .spread(function(user, created) {
        return user.createFolder({
            name: req.body.name,
            parentId: req.body.parentId
        });
    })
    .then(function(folder) {
        return res.status(201).json(folder);
    })
    .catch(function (err) {
        return res.status(403).json(err);
    });
};

// Update a folder: 1) name, 2) parentId.  
// prevents:
// - updating non-existent folder
// - updating ROOT folder
// - creating a lineage cycle
// - moving itself to one of its subfolders
exports.update = function(req, res) {
    var username = setUserName(req);

    Folder.find({where: {id: req.params.folderid, UserUsername: username}})
    .then(function(folder) {

        // never allow requests to update ROOT folder
        if (folder.name === 'ROOT' && folder.hierarchyLevel === 1) {
            return res.status(403).json({
                error: 'invalid request: cannot change ROOT folder'
            });
        }

        folder.updateAttributes({
            name: req.body.name,
            parentId: req.body.parentId
        })
        .then(function(folder) {
            return res.status(200).json(folder);
        })
        .catch(function (err) {
            res.status(403).json(err);
        });        
    });
};


// Remove a folder and all of its descendants
exports.removeFolder = function (req, res) {
    var username = setUserName(req);

    Folder.find({where: {id: req.params.folderid, UserUsername: username}})
    .then(function(folder) {

        // never allow requests to update ROOT folder
        if (folder.name === 'ROOT' && folder.hierarchyLevel === 1) {
            return res.status(403).json({
                error: 'invalid request: cannot delete ROOT folder'
            });
        }

        var folders = [folder];
        folder.getDescendents().then(function(descendants) {
            folders = folders.concat(descendants);
            Sequelize.Promise.each(folders, function(folder) {
                folder.parentId = null;
                folder.save().then(function(){
                    folder.destroy();
                });
            })
            .then(function(affectedRows) {
                return res.status(200).json({affected: affectedRows});
            });
        });
    })
    .catch(function(err) {
        console.log(err);
        res.status(403).json(err);
    });
};


// Create one or more FolderItem objects
exports.createFolderItems = function(req, res) {
    var username = setUserName (req);

    console.log(req.params.folderid);
    Folder.find({where: {id: req.params.folderid, UserUsername: username}})
    .then(function(folder) {
        assert.notEqual(folder, null);
        return Sequelize.Promise.each(req.body.items, function(item) {
            return folder.createFolderItem(item);
        });
    })
    .then(function(affectedRows) {
        return res.status(201).json({affected: affectedRows});
    })
    .catch(function (err) {
        // console.log(err);
        return res.status(403).json(err);
    });
}

// Remove one or more FolderItem objects
exports.removeFolderItems = function(req, res) {
    var username = setUserName (req);

    var errors = [];
    Sequelize.Promise.each(req.body.items, function(item) {
        FolderItem.find({where: {
            FolderId: req.params.folderid,
            elasticId: item.elasticId
        }})
        .then(function(folderitem) {
            if (folderitem === null) {
                throw new Error('item', item, 'not found');
            }
            return folderitem.destroy();
        })
        .catch(function(err) {
            // console.log(err);
        });
    })
    .then(function(affectedRows) {
        return res.status(200).json({affected: affectedRows});
    })
    .catch(function (err) {
        console.log(err);
        return res.status(403).json(err);
    });
}
