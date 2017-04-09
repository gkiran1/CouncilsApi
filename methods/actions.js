//var User = require('../model/user');
//var config = require('../config/database');
var jwt = require('jwt-simple');
var email = require('emailjs/email');
var emailConfig = require('../config/emailconfig');
var ionicPushServer = require('ionic-push-server');
var https = require('https');
var querystring = require('querystring');

var functions = {
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
    getinfo: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            return res.json({ success: true, msg: 'hello ' + decodedtoken.name });
        }
        else {
            return res.json({ success: false, msg: 'No header' });
        }
    },
    pushmessage: function (req, res) {
        var credentials = {
            IonicApplicationID: "a687fb87",
            IonicApplicationAPItoken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYTcxOWU1MS1iNDJlLTQ2NWEtYTdiOS03MTAxMWZhNGQ3YmIifQ.aE4k3dL_vjZBIDxxdDu1wYIJMBjXIUUWYy9lcmLCW5A"
        };
        var notification = {

            "profile": "ionpush",
            "notification": {
                "title": "Hi",
                "message": "Hello world!",
                "android": {
                    "title": "Hey",
                    "message": "Hello Android!"
                },
                "ios": {
                    "title": "Howdy",
                    "message": "Hello iOS!"
                }
            }
        };

        var options = {
            hostname: 'api.ionic.io',
            path: '/push/notifications',
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + credentials.IonicApplicationAPItoken
            }
        };

        var req = https.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
        });

        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });

        req.write(JSON.stringify(notification));
        req.end();

    },
    sendmail: function (req, res) {
        debugger;
        var emailText = "Dear " + req.body.firstname + ",\n\nYour Councils account is active.  Please download the app for full access to your unit #" + req.body.unitnum + ".";
        var androidLink = "http://google.com";
        var iosLink = "http://apple.com";
        var emailHtml = "<html>Dear " + req.body.firstname + ",<br><br>Your Councils account is active.  Please download the app for full access to your unit #" + req.body.unitnum + ". "
            +"<br><br><a href='" + iosLink + "'><img src='cid:playstore' width='150' height='50' /></a>"
            +"<br><a href='" + androidLink + "'><img src='cid:appstore' width='150' height='50' /></a><br><br>**********</html>"

        console.log(emailConfig);
        console.log(req.body.email);
        var server = email.server.connect({
            user: emailConfig.user,// "AKIAJGVSLVYWN7HUBMJA", 
            password: emailConfig.password, //,"AtEKBfKDYls8QSZ622qLDHugXb9bDsJbwQ7+zeFiNrEx", 
            host: emailConfig.host, //"smtp.gmail.com",// "email-smtp.us-west-2.amazonaws.com", 
            ssl: emailConfig.ssl,
            port: emailConfig.sslport,
            timeout: emailConfig.servertimeout
        });
        var headers = {
            //text: emailText+"\n\n"+androidLink+"\n"+iosLink+"\n\n *************",


            from: emailConfig.from,
            to: req.body.email,
            subject: "Welcome to Councils",
            attachment:
            [
                { data: emailHtml, alternative: true },
                

                {path:"./img/playstore.png", type:"image/png", headers:{"Content-ID":"playstore"}},
                { path: "./img/appstore.png", type: "image/png", headers: { "Content-ID": "appstore" } }
            ]
        };
        var message = email.message.create(headers);
        server.send(message
            , function (err, message) {
                if (err)
                    console.log(err);
                else
                    res.json({ success: true, msg: 'sent' });
            });

    }


}

module.exports = functions;
