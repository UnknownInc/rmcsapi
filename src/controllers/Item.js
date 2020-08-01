'use strict';

var utils = require('../utils/writer.js');
var Item = require('../service/ItemService');

module.exports.getLikes = function getLikes (req, res, next, itemId) {
  Item.getLikes(itemId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateLikes = function updateLikes (req, res, next, body, itemId) {
  Item.updateLikes(body, itemId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
