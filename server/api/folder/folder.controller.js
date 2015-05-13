'use strict';

var _ = require('lodash');
var folders = [
      {
        _id: 0,
        username: "test",
        name: "ROOT",
        childIds: [1, 3]
      },{
        _id: 1,
        username: "test",
        name: "folder1",
        parentId: 0,
        childIds: [2]
      },{
        _id: 2,
        username: "test",
        name: "folder2",
        parentId: 1,
        childIds: []
      },{
        _id: 3,
        username: "test",
        name: "folder3",
        parentId: 0,
        childIds: [4]
      },{
        _id: 4,
        username: "test",
        name: "folder4",
        parentId: 3,
        childIds: [5, 6]
      },{
        _id: 5,
        username: "test",
        name: "folder5",
        parentId: 4,
        childIds: []
      },{
        _id: 6,
        username: "test",
        name: "folder6",
        parentId: 4,
        childIds: []
      }
    ];
var nextIndex = 7;

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
  if(req.body.name == "ROOT" || req.headers.user !== "test") {
    return res.send(404);
  }

  var index = folders.length;
  folders[index] = req.body;
  folders[index]._id = nextIndex;
  var id = folders[index]._id;
  nextIndex++;

  // Add folder reference to parent
  var parentIndex = findIndex(parseInt(req.body.parentId));
  folders[parentIndex].childIds.push(id);

  // Change children(s) parent reference (if any)
  var children = folders[index].childIds;
  for(var i = 0; i < children.length; i++) {
    var childIndex = findIndex(children[i]);
    if(childIndex != -1) {
      // remove child reference in child's parent
      var childOldParentIndex = findIndex(folders[childIndex].parentId);
      folders[childOldParentIndex].childIds.splice(folders[childOldParentIndex].childIds.indexOf(children[i]), 1);

      // change parent reference for good
      folders[childIndex].parentId = id;
    }
  }

  return res.json(201, folders[index]);
};

// Updates an existing folder in the DB
exports.update = function(req, res) {
  if(req.body.name == "ROOT" || req.headers.user !== "test") {
    return res.send(404);
  }

  var id = parseInt(req.params.id);
  var index = findIndex(id);

  if(index == -1) {
    return res.send(404);
  } else if(folders[index].name == "ROOT") {
    return res.send(404);
  }

  // remove folder reference in parent folder
  var parentIndex = findIndex(folders[index].parentId);
  folders[parentIndex].childIds.splice(folders[parentIndex].childIds.indexOf(index), 1);

  folders[index].name = req.body.name;
  folders[index].parentId = req.body.parentId;

  // add folder reference in new parent folder
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

  if(index == -1) {
    return res.send(404);
  } else if(folders[index].name == "ROOT") {
    return res.send(404);
  }

  // remove folder reference in parent folder
  var parentIndex = findIndex(folders[index].parentId);
  folders[parentIndex].childIds.splice(folders[parentIndex].childIds.indexOf(index), 1);

  // remove child folders recursively (if any)
  removeChildren(folders[index].childIds)

  folders.splice(index, 1);

  return res.send(204);
};

function removeChildren(children) {
  for(var i = 0; i < children.length; i++) {
    var childIndex = findIndex(children[i]);
    if(childIndex != -1) {
      removeChildren(folders[childIndex].childIds);
      folders.splice(childIndex, 1);
    }
  }
}

function findIndex(id) {
  var index;

  for(index = 0; index < folders.length; index++) {
    if(folders[index]._id == id) {
      return index;
    }
  }

  return -1;
}