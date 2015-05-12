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

  if(req.params.id == 0) {
    return res.json(folders[0]);
  } else if(req.params.id == 1) {
    return res.json(folders[1]);
  } else if(req.params.id == 2) {
    return res.json(folders[2]);
  } else if(req.params.id == 3) {
    return res.json(folders[3]);
  } else if(req.params.id == 4) {
    return res.json(folders[4]);
  } else if(req.params.id == 5) {
    return res.json(folders[5]);
  } else if(req.params.id == 6) {
    return res.json(folders[6]);
  }else {
    return res.send(404);
  }
};