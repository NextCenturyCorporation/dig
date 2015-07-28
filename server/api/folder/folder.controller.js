'use strict';

var _ = require('lodash'),
    models = require('../../models'),
    User = models.User,
    Folder = models.Folder;

var setUserName = function (req) {
    if (req.params.username === 'reqHeader') {
        req.params.username = req.headers.user;
    }
    return req.params.username;
};

var folders = [
      {
        _id: 0,
        username: "test",
        name: "ROOT",
        childIds: []
      }
    ];
var nextIndex = 1;



// Get list of folders based on user
exports.index2 = function(req, res) {
    var userName = setUserName(req);
    User.findOne({where: {username: 'test'}})
    .then(function(user) {
        return user.getFolders({include: [FolderItem]})
    })
    .then(function(folders){
        return res.json(folders);
    })
    .catch(function(err) {
        res.status(404).json(err);
    })  
};

// Get list of folders based on user
exports.index = function(req, res) {
  if(req.headers.user == "test") {
    return res.json(folders);
  } else {
    return res.status(404).end();
  }
};

// Get a single folder
exports.show = function(req, res) {
  if(req.headers.user !== "test") {
    return res.status(404).end();
  }

  var id = parseInt(req.params.id);
  var index = findIndex(id);

  if(index == -1) {
    return res.status(404).end();
  }

  return res.json(folders[index]);
};

// Creates a new folder in the DB
exports.create = function(req, res) {
  // Prevents:
  //    - creating folder with name ROOT
  //    - creating in another user's folders
  //    - adding itself as its parent
  //    - adding itself as its child
  if(req.body.name == "ROOT" || req.headers.user !== "test" ||
      req.body.parentId == nextIndex || req.body.childIds.indexOf(nextIndex) != -1) {
    return res.status(404).end();
  }

  var parentIndex = findIndex(parseInt(req.body.parentId));

  // Prevent adding with unknown parent and adding folders within themselves
  if(parentIndex == -1 || findIDInChildren(parentIndex, req.body.childIds)) {
    return res.status(404).end();
  }

  // Create new folder with new _id
  var index = folders.length;
  folders[index] = req.body;
  folders[index]._id = nextIndex;
  var id = folders[index]._id;
  nextIndex++;

  // Add folder reference to its parent
  folders[parentIndex].childIds.push(id);

  // Change children(s) parent reference (if any)
  var children = folders[index].childIds;
  for(var i = 0; i < children.length; i++) {
    // Get child's index in folder area
    var childIndex = findIndex(children[i]);
    if(childIndex != -1) {
      // Remove this child's reference in its old parent
      var childOldParentIndex = findIndex(folders[childIndex].parentId);
      folders[childOldParentIndex].childIds.splice(folders[childOldParentIndex].childIds.indexOf(children[i]), 1);

      // Change parent reference in this child for good
      folders[childIndex].parentId = id;
    }
  }

  return res.status(201).json(folders[index]);
};

// Updates an existing folder in the DB
exports.update = function(req, res) {
  // Prevents changing name to ROOT (or changing ROOT folder in general) and
  // changing another user's folders
  if(req.body.name == "ROOT" || req.headers.user !== "test") {
    return res.status(404).end();
  }

  var id = parseInt(req.params.id);
  var index = findIndex(id);

  // Prevents:
  //    - updating non-existant folder
  //    - changing ROOT folder
  //    - adding itself as its parent
  //    - moving itself to one of its subfolders
  if(index == -1) {
    return res.status(404).end();
  } else if(folders[index].name == "ROOT" ||
      req.body.parentId == id || findIDInChildren(req.body.parentId, folders[index].childIds)) {
    return res.status(404).end();
  }

  // Remove folder reference in its parent folder
  var parentIndex = findIndex(folders[index].parentId);
  folders[parentIndex].childIds.splice(folders[parentIndex].childIds.indexOf(index), 1);

  // Update its name and parentID
  folders[index].name = req.body.name;
  folders[index].parentId = req.body.parentId;

  // Add new items (if any) to existing folder items
  if(req.body.items) {
    for(var i = 0; i < req.body.items.length; i++) {
      // Only add items that aren't already in the folder
      if(_.indexOf(folders[index].items, req.body.items[i]) == -1) {
        folders[index].items.push(req.body.items[i]);
      }
    }
  }

  // Add new children (if any) to existing folder children
  if(req.body.childIds) {
    for(var i = 0; i < req.body.childIds.length; i++) {
      // If child's id not in folder, add it and change the child's parent
      if(_.indexOf(folders[index].childIds, req.body.childIds[i]) == -1) {
        folders[index].childIds.push(req.body.childIds[i]);

        // Get child's index in folder area
        var childIndex = findIndex(req.body.childIds[i]);
        if(childIndex != -1) {
          // Remove this child's reference in its old parent
          var childOldParentIndex = findIndex(folders[childIndex].parentId);
          folders[childOldParentIndex].childIds.splice(folders[childOldParentIndex].childIds.indexOf(req.body.childIds[i]), 1);

          // Change parent reference in this child for good
          folders[childIndex].parentId = id;
        }
      }
    }
  }

  // Add folder reference in its new parent folder
  var newParentIndex = findIndex(folders[index].parentId);
  folders[newParentIndex].childIds.push(id);

  return res.status(200).json(folders[index]);
};

// Removes items in an existing folder in the DB
exports.removeItems = function(req, res) {
  // Prevents changing name to ROOT (or changing ROOT folder in general) and
  // changing another user's folders
  if(req.body.name == "ROOT" || req.headers.user !== "test") {
    return res.status(404).end();
  }

  var id = parseInt(req.params.id);
  var index = findIndex(id);

  // Prevents:
  //    - updating non-existant folder
  //    - changing ROOT folder
  if(index == -1) {
    return res.status(404).end();
  } else if(folders[index].name == "ROOT") {
    return res.status(404).end();
  }

  // Check child folder ids are valid
  if(req.body.childIds) {
    var invalidChildren = false;
    for(var i = 0; i < req.body.childIds.length; i++) {
      if(_.indexOf(folders[index].childIds, req.body.childIds[i]) == -1) {
        invalidChildren = true;
      }
    }
    if(invalidChildren) {
      return res.status(404).end();
    }
  }

  // Remove items (if any) from an existing folder
  if(req.body.items) {
    for(i = 0; i < req.body.items.length; i++) {
      // Remove item if it exists
      var itemIndex = _.indexOf(folders[index].items, req.body.items[i]);
      if(itemIndex != -1) {
        folders[index].items.splice(itemIndex, 1);
      }
    }
  }

  // Recursively remove child folders (if any) from an existing folder
  if(req.body.childIds) {

    // Remove children reference in folder's childIds
    var newChildIds = [];
    for(i = 0; i < folders[index].childIds.length; i++) {
      if(_.indexOf(req.body.childIds, folders[index].childIds[i]) == -1) {
        newChildIds.push(folders[index].childIds[i]);
      }
    }
    folders[index].childIds = newChildIds;

    removeChildren(req.body.childIds);
  }

  return res.status(200).json(folders[findIndex(id)]);
};

// Deletes a folder from the DB
exports.destroy = function(req, res) {
  if(req.headers.user !== "test") {
    return res.status(404).end();
  }

  var id = parseInt(req.params.id);
  var index = findIndex(id);

  // Prevents removing unknown folder and removing the ROOT folder
  if(index == -1) {
    return res.status(404).end();
  } else if(folders[index].name == "ROOT") {
    return res.status(404).end();
  }

  // Remove folder reference in its parent folder
  var parentIndex = findIndex(folders[index].parentId);
  folders[parentIndex].childIds.splice(folders[parentIndex].childIds.indexOf(index), 1);

  // Remove child folders recursively (if any)
  removeChildren(folders[index].childIds)

  // Remove folder itself
  folders.splice(findIndex(id), 1);

  return res.sendStatus(204).end();
};

// Finds the id in the given children (recursively).
// Returns 1 if the id was found or 0 if not.
function findIDInChildren(id, children) {
  var found = 0;

  for(var i = 0; i < children.length; i++) {
    // ID was found, return 1
    if(children[i] == id) {
      return 1;
    }

    // Find child's index in folders array to find and search its children
    var childIndex = findIndex(children[i]);
    if(childIndex != -1) {
      found = findIDInChildren(id, folders[childIndex].childIds);
    }
  }

  // ID not found, return 0
  return found;
};

// Removes the given children from the folders array (recursively)
function removeChildren(children) {
  for(var i = 0; i < children.length; i++) {
    var childIndex = findIndex(children[i]);
    if(childIndex != -1) {
      // Get the child's children, remove the child, then remove its children
      var childIds = folders[childIndex].childIds;
      folders.splice(childIndex, 1);
      removeChildren(childIds);
    }
  }
}

// Finds index in folders array based on the given id.
// Returns the index or -1 if not found.
function findIndex(id) {
  var index;

  for(index = 0; index < folders.length; index++) {
    if(folders[index]._id == id) {
      return index;
    }
  }

  return -1;
}