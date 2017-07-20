var express = require('express');
var actions = require('../methods/actions');

var router = express.Router();

//router.post('/authenticate', actions.authenticate);
//router.post('/adduser', actions.addNew);
//router.get('/getinfo', actions.getinfo);
router.get('/', actions.get);
router.post('/sendmail', actions.sendmail);
router.post('/donate', actions.donate);
router.post('/donate-monthly', actions.donateMonthly);
router.post('/nextpayment-date', actions.getNextPaymentDate);
router.post('/cancel-subscription', actions.cancelSubscription);
//router.post('/identicon', actions.identicon);
// router.post('/pushmessage', actions.pushmessage);
module.exports = router;