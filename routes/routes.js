var express = require('express');
var actions = require('../methods/actions');

var router = express.Router();

//router.post('/authenticate', actions.authenticate);
//router.post('/adduser', actions.addNew);
//router.get('/getinfo', actions.getinfo);
router.post('/sendmail', actions.sendmail);
router.post('/pushmessage', actions.pushmessage);
module.exports = router;