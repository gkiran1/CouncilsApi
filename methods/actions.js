var email = require('emailjs/email');
var emailConfig = require('../config/emailconfig');
var ionicPushServer = require('ionic-push-server');
var jwt = require('jwt-simple');
var https = require('https');
var querystring = require('querystring');
var emailHandler = require('./handlers/emailhandler');
var paymentHandler = require('./handlers/paymenthandler');

var functions = {
    
    donate : function(req, res) {
        paymentHandler(req, res);
    },
    sendmail: function (req, res) {
        emailHandler(req, res, emailConfig);       

    },
    // authenticate: function(req, res) {
    //     User.findOne({
    //         name: req.body.name
    //     }, function(err, user){
    //         if (err) throw err;

    //         if(!user) {
    //             res.status(403).send({success: false, msg: 'Authentication failed, User not found'});
    //         }

    //        else {
    //             user.comparePassword(req.body.password, function(err, isMatch){
    //                 if(isMatch && !err) {
    //                     var token = jwt.encode(user, config.secret);
    //                     res.json({success: true, token: token});
    //                 } else {
    //                     return res.status(403).send({success: false, msg: 'Authenticaton failed, wrong password.'});
    //                 }
    //             })
    //         }

    //     })
    // },
    // addNew: function(req, res){
    //     if((!req.body.name) || (!req.body.password)){
    //         console.log(req.body.name);
    //         console.log(req.body.password);

    //         res.json({success: false, msg: 'Enter all values'});
    //     }
    //     else {
    //         var newUser = User({
    //             name: req.body.name,
    //             password: req.body.password
    //         });

    //         newUser.save(function(err, newUser){
    //             if (err){
    //                 res.json({success:false, msg:'Failed to save'})
    //             }

    //             else {
    //                 res.json({success:true, msg:'Successfully saved'});
    //             }
    //         })
    //     }
    // },
    // getinfo: function (req, res) {
    //     if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    //         var token = req.headers.authorization.split(' ')[1];
    //         var decodedtoken = jwt.decode(token, config.secret);
    //         return res.json({ success: true, msg: 'hello ' + decodedtoken.name });
    //     }
    //     else {
    //         return res.json({ success: false, msg: 'No header' });
    //     }
    // },
    // pushmessage: function (req, res) {
    //     var credentials = {
    //         IonicApplicationID: "a687fb87",
    //         IonicApplicationAPItoken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYTcxOWU1MS1iNDJlLTQ2NWEtYTdiOS03MTAxMWZhNGQ3YmIifQ.aE4k3dL_vjZBIDxxdDu1wYIJMBjXIUUWYy9lcmLCW5A"
    //     };
    //     var notification = {

    //         "profile": "ionpush",
    //         "notification": {
    //             "title": "Hi",
    //             "message": "Hello world!",
    //             "android": {
    //                 "title": "Hey",
    //                 "message": "Hello Android!"
    //             },
    //             "ios": {
    //                 "title": "Howdy",
    //                 "message": "Hello iOS!"
    //             }
    //         }
    //     };

    //     var options = {
    //         hostname: 'api.ionic.io',
    //         path: '/push/notifications',
    //         method: 'POST',
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": "Bearer " + credentials.IonicApplicationAPItoken
    //         }
    //     };

    //     var req = https.request(options, function (res) {
    //         console.log('STATUS: ' + res.statusCode);
    //         console.log('HEADERS: ' + JSON.stringify(res.headers));
    //         res.setEncoding('utf8');
    //         res.on('data', function (chunk) {
    //             console.log('BODY: ' + chunk);
    //         });
    //     });

    //     req.on('error', function (e) {
    //         console.log('problem with request: ' + e.message);
    //     });

    //     req.write(JSON.stringify(notification));
    //     req.end();

    // }


}

module.exports = functions;
