'use strict';

var _ = require('lodash');

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
exports.index = function(req, res) {
  if(req.headers.user == "test") {
    return res.json(folders);
  } else {
    return res.send(404);
  }
};

// Get a single folder
exports.show = function(req, res) {
  if(req.headers.user !== "test") {
    return res.send(404);
  }

  var id = parseInt(req.params.id);
  var index = findIndex(id);

  if(index == -1) {
    return res.send(404);
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
    return res.send(404);
  }

  var parentIndex = findIndex(parseInt(req.body.parentId));

  // Prevent adding with unknown parent and adding folders within themselves
  if(parentIndex == -1 || findIDInChildren(parentIndex, req.body.childIds)) {
    return res.send(404);
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

  return res.json(201, folders[index]);
};

// Updates an existing folder in the DB
exports.update = function(req, res) {
  // Prevents changing name to ROOT (or changing ROOT folder in general) and
  // changing another user's folders
  if(req.body.name == "ROOT" || req.headers.user !== "test") {
    return res.send(404);
  }

  var id = parseInt(req.params.id);
  var index = findIndex(id);

  // Prevents:
  //    - updating non-existant folder
  //    - changing ROOT folder
  //    - adding itself as its parent
  //    - adding itself as its child
  //    - moving itself to one of its subfolders
  if(index == -1) {
    return res.send(404);
  } else if(folders[index].name == "ROOT" ||
      folders[index].parentId == id || folders[index].childIds.indexOf(id) != -1 ||
      findIDInChildren(folders[index].parentId, folders[index].childIds)) {
    return res.send(404);
  }

  // Remove folder reference in its parent folder
  var parentIndex = findIndex(folders[index].parentId);
  folders[parentIndex].childIds.splice(folders[parentIndex].childIds.indexOf(index), 1);

  // Update its name and parentID
  folders[index].name = req.body.name;
  folders[index].parentId = req.body.parentId;

  // Add folder reference in its new parent folder
  var newParentIndex = findIndex(folders[index].parentId);
  folders[newParentIndex].childIds.push(id);

  return res.json(200, folders[index]);
};

// Deletes a folder from the DB
exports.destroy = function(req, res) {
  if(req.headers.user !== "test") {
    return res.send(404);
  }

  var id = parseInt(req.params.id);
  var index = findIndex(id);

  // Prevents removing unknown folder and removing the ROOT folder
  if(index == -1) {
    return res.send(404);
  } else if(folders[index].name == "ROOT") {
    return res.send(404);
  }

  // Remove folder reference in its parent folder
  var parentIndex = findIndex(folders[index].parentId);
  folders[parentIndex].childIds.splice(folders[parentIndex].childIds.indexOf(index), 1);

  // Remove child folders recursively (if any)
  removeChildren(folders[index].childIds)

  // Remove folder itself
  folders.splice(findIndex(id), 1);

  return res.send(204);
};

// Finds the id in the given children (recursively).
// Returns 1 if the id was found or 0 if not.
function findIDInChildren(id, children) {
  for(var i = 0; i < children.length; i++) {
    // ID was found, return 1
    if(children[i] == id) {
      return 1;
    }

    // Find child's index in folders array to find and search its children
    var childIndex = findIndex(children[i]);
    if(childIndex != -1) {
      return findIDInChildren(id, folders[childIndex].childIds);
    }
  }

  // ID not found, return 0
  return 0;
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