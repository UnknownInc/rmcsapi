/* eslint-disable no-unused-vars */
const Service = require('./Service');
const log = require('debug');
const trace = log('rmcs:item');
const error = log('rmcs:error:item');

import {db} from './firebase.js';
const ITEMS_COLLECTION='/rmcsapi_items';
/**
* Gets the count of the likes for the itemId
*
* itemId String 
* returns inline_response_200
* */
const getLikes = async function ({ itemId }) {
  try {
    trace(`getting likes for ${itemId}`);
    const itemRef =  db().collection(ITEMS_COLLECTION).doc(itemId);
    const itemSnapshot = await itemRef.get();
    const item = itemSnapshot.data();
    if (item) { 
      return Service.successResponse({
        count: item.likes
      });
    }
    return Service.rejectResponse(null,404)
  } catch (e) {
    error('%O', e);
    return Service.rejectResponse({errors: []});
  }
}
/**
* Gets widget to display the likes for the itemId
*
* itemId String 
* label String  (optional)
* returns String
* */
const getLikesWidget = async function ({ itemId, label }) {
  try {
    trace(`getting likes for ${itemId}`);
    const itemRef =  db().collection(ITEMS_COLLECTION).doc(itemId);
    const itemSnapshot = await itemRef.get();
    const item = itemSnapshot.data();
    if (item) { 
      const icontag=`<span id='lic'>&#10084;&#65039;</span>&nbsp;`;
      const labeltag=`<span id='ll'>${label}</span>&nbsp;`;
      return Service.successResponse(`
<html>
<head>
<style>
body { margin:0; padding: 0px;}
#lb {
  padding: 2px;
  color:#555555;
  border: solid 1px #cccccc;
  border-radius:4px;
  display: inline-block;
  background: rgb(221,221,221);
  cursor:pointer;
  background: linear-gradient(0deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 35%, rgba(255,255,255,1) 65%, rgba(221,221,221,1) 100%);
}
#lb:hover { 
  background: white;
  background: linear-gradient(0deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 25%, rgba(255,255,255,1) 75%, rgba(221,221,221,1) 100%);
}
</style>
</head>
<body>
<div id='lb'>
&nbsp;${icontag}${labeltag}<span id='lc'>${item.likes}</span>&nbsp;
</div>
<script>
    var processing=false;
    var lbDOM = document.getElementById('lb');
    var lcDOM = document.getElementById('lc');
    lbDOM.onclick = function likeClick(){
      if (processing) return;
      processing=true;
      var vt= window.localStorage.getItem('rv-${itemId}');
      if (vt) {
        processing=false;
        return;
      }
      lbDOM.style='pointer-events:none;opacity:0.5;transform:scale(0.8)';
      function reqListener () {
        try {
          var data=JSON.parse(this.responseText);
          lc.innerHTML=''+data.count;
          window.localStorage.setItem('rv-${itemId}',''+Date.now())
        } catch (e) {
          console.error(e);
        } finally {
          processing=false;
          lbDOM.style='';
        }
      }
      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", reqListener);
      oReq.open("POST", "/v1/${itemId}/likes/");
      oReq.setRequestHeader('Content-Type', 'application/json')
      oReq.send('{"op":"inc"}');
    }
</script>
</body>
</html>
`);
    }
    return Service.rejectResponse(null, 404);
  } catch (e) {
    error('%O', e);
    return Service.rejectResponse({errors: [e.message]}, 500);
  } 
}
/**
* Update by Incrementing or Decrementing the count of the likes for the itemId
*
* itemId String 
* inlineObject InlineObject  (optional)
* returns inline_response_200
* */
const updateLikes = async function (data) {
  const {itemId, body} = data;
  console.log(data);
  try {
    trace(`updating likes for ${itemId}`);
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
          return Service.rejectResponse({errors:['Invalid value for op']}, 400)
      }
    } catch(e) {
      error('%O', e);
      return Service.rejectResponse(null, 404);
    }

    const itemSnapshot = await itemRef.get();
    const item = itemSnapshot.data();
    if (item) { 
      return Service.successResponse({
        count: item.likes
      })
    }
    return Service.rejectResponse(null, 404);
  } catch (e) {
    error('%O', e);
    return Service.rejectResponse(e.message, 500);
  }
}

module.exports = {
  getLikes,
  getLikesWidget,
  updateLikes,
};
