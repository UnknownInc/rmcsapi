'use strict';
const debug = require('debug')('rmcs:item');
import {db} from './firebase.js';
var utils = require('../utils/writer.js');


const ITEMS_COLLECTION='/rmcsapi_items';

/**
 * Gets the count of the likes for the itemId
 *
 * itemId String 
 * returns inline_response_200
 **/
exports.getLikes = async function(itemId) {
  try {
    debug(`getting likes for ${itemId}`);
    const itemRef =  db().collection(ITEMS_COLLECTION).doc(itemId);
    const itemSnapshot = await itemRef.get();
    const item = itemSnapshot.data();
    if (item) { 
      return {
        count: item.likes
      }
    }
    return utils.respondWithCode(404)
  } catch (e) {
    debug('%O', e);
    return utils.respondWithCode(500, {errors: []});
  }
}

/**
 * Increments/Decrements the count of the likes for the itemId
 *
 * body Body  (optional)
 * itemId String 
 * returns inline_response_200
 **/
exports.updateLikes = async function(body,itemId) {
  try {
    debug(`updating likes for ${itemId}`);
    const itemRef =  db().collection(ITEMS_COLLECTION).doc(itemId);

    try {
      switch(body.op){
        case 'inc':
          await itemRef.update('likes', db.FieldValue.increment(1));
          break;
        case 'dec':
          await itemRef.update('likes', db.FieldValue.increment(-1));
          break;
        case 'reset':
          await itemRef.update('likes', 0);
          break;
        default:
          return utils.respondWithCode(400,{errors:['Invalid value for op']})
      }
    } catch(e) {
      return utils.respondWithCode(404);
    }

    const itemSnapshot = await itemRef.get();
    const item = itemSnapshot.data();
    if (item) { 
      return {
        count: item.likes
      }
    }
    return utils.respondWithCode(404)
  } catch (e) {
    debug('%O', e);
    return utils.respondWithCode(500, {errors: []});
  }
}

