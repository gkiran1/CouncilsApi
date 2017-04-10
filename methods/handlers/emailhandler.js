var email = require('emailjs/email');

var emailHandler = function (req, res, config) {
    var emailText = "Dear " + req.body.firstname + ",\n\nYour Councils account is active.  Please download the app for full access to your unit #" + req.body.unitnum + ".";
    var androidLink = "http://google.com";
    var iosLink = "http://apple.com";
    var emailHtml = "<html>Dear " + req.body.firstname + ",<br><br>Your Councils account is active.  Please download the app for full access to your unit #" + req.body.unitnum + ". "
        + "<br><br><a href='" + iosLink + "'><img src='cid:playstore' width='150' height='50' /></a>"
        + "<br><a href='" + androidLink + "'><img src='cid:appstore' width='150' height='50' /></a><br><br>**********</html>"

    console.log(config);
    console.log(req.body.email);
    var server = email.server.connect({
        user: config.user,// "AKIAJGVSLVYWN7HUBMJA", 
        password: config.password, //,"AtEKBfKDYls8QSZ622qLDHugXb9bDsJbwQ7+zeFiNrEx", 
        host: config.host, //"smtp.gmail.com",// "email-smtp.us-west-2.amazonaws.com", 
        ssl: config.ssl,
        tls: config.tls,
        port: config.tlsport,
        timeout: config.servertimeout,
        domain: null
    });
    var headers = {
        //text: emailText+"\n\n"+androidLink+"\n"+iosLink+"\n\n *************",

        from: config.from,
        to: req.body.email,
        subject: "Welcome to Councils",
        attachment:
        [
            { data: emailHtml, alternative: true },

            { path: "./img/playstore.png", type: "image/png", headers: { "Content-ID": "playstore" } },
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

module.exports = emailHandler;