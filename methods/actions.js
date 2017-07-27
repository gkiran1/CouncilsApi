var ionicPushServer = require('ionic-push-server');
var jwt = require('jwt-simple');
var https = require('https');
var querystring = require('querystring');
var emailHandler = require('./handlers/emailhandler');
var paymentHandler = require('./handlers/paymenthandler');
var monthlyPaymentHandler = require('./handlers/monthlyPaymentHandler');
var nextPaymentHandler = require('./handlers/nextPaymentHandler');
var cancelSubscriptionHandler = require('./handlers/cancelSubscriptionHandler');
var cronHandler = require('./handlers/cronhandler');
//var identiconHandler = require('./handlers/identiconhandler');

var functions = {
    get: function (req, res) {
        res.json({ success: true, msg: 'Councils API in action...' });
    },

    // donate: function (req, res) {
    //     paymentHandler(req, res);
    // },
    // donateMonthly: function (req, res) {
    //     monthlyPaymentHandler(req, res);
    // },
    // getNextPaymentDate: function (req, res) {
    //     nextPaymentHandler(req, res);
    // },
    // cancelSubscription: function (req, res) {
    //     cancelSubscriptionHandler(req, res);
    // },
    sendmail: function (req, res) {
        emailHandler.sendmail(req, res);

    },
    autodeleteagendas: function (req, res) {
        cronHandler.deleteAgendas(req, res);
    },
    autodeleteassignments: function (req, res) {
        cronHandler.deleteAssignments(req, res);
    },
    autodeletediscussions: function (req, res) {
        cronHandler.deleteDiscussions(req, res);
    }
    

}

module.exports = functions;
