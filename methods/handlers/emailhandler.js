var email = require('emailjs/email');
var config = require('../../config/emailconfig');

var emailHandler =  {

        sendmail : function (req, res) {
        switch(req.body.event) {
            case 'invite' :
                this.invite(req, res);
                break;
            case 'accountcreated' :
                this.accountCreated(req, res);
                break;
            case 'forgotpassword' :
                this.forgotPassword(req, res);
                break;
            case 'inactivated' :
                this.accountInactivated(req, res);
                break;
            case 'reactivated' :
                this.accountReactivated(req, res);
                break;
            case 'editmember' :
                this.councilsEdited(req, res);
                break;
            case 'admintransfer' :
                this.adminTransfered(req, res);
                break;
        }
    },
    invite : function (req, res) {
        var emailText = "Dear " + req.body.firstname + ",\n\nYour Councils account is active.  Please download the app for full access to your unit #" + req.body.unitnum + ".";
        var androidLink = "http://google.com";
        var iosLink = "http://apple.com";
        var subject = "Welcome to Councils!"
        var emailHtml = "<html><body>Dear " + req.body.firstname + ",<br><br>Your Councils account is active.  Please download the app for full access to your unit #" + req.body.unitnum + ". "
            + "<br><br><table border='0' cellpadding='10' cellspacing='0' style='border-collapse:collapse'><tr><td> <a href='" + iosLink + "'><img src='cid:appstore' width='200' height='60' /></a></td>"
            + "<td><a href='" + androidLink + "'><img src='cid:playstore' width='236' height='92' /></a></td></tr></table><br><br>**********</body></html>";
            var attachment = [
                { data: emailHtml, alternative: true },
                { path: "./img/playstore-badge.png", type: "image/png", headers: { "Content-ID": "<playstore>" } },
                { path: "./img/appstore-badge.png", type: "image/png", headers: { "Content-ID": "<appstore>" } }
            ];

        this.send(req.body.email, subject, emailText, attachment, res);
    },

    accountCreated : function(req) {

    },

    forgotPassword : function(req) {

    }, 
    
    accountInactivated : function(req) {

    }, 
    
    accountReactivated : function(req) {

    },

    adminTransfered : function(req) {

    },

    councilsEdited : function(req) {

    },    

    send : function(to, subject, bodytext, attachment, res) {
       
        var server = email.server.connect({
            user: config.user,// "AKIAJGVSLVYWN7HUBMJA", 
            password: config.password, //,"AtEKBfKDYls8QSZ622qLDHugXb9bDsJbwQ7+zeFiNrEx", 
            host: config.host, //"smtp.gmail.com",// "email-smtp.us-west-2.amazonaws.com", 
            ssl: config.ssl,
            //tls: config.tls,
            port: config.sslport,

            timeout: config.servertimeout,
            //domain: "councils.io"
        });
        var headers = {
            //text: bodytext+"\n\n"+androidLink+"\n"+iosLink+"\n\n *************",

            from: config.from,
            to: to,
            subject: subject,
            attachment: attachment
            
        };
        var message = email.message.create(headers);
        server.send(message
            , function (err, message) {
                if (err) {
                    
                    res.status(400).send({msg: err});
                }
                else
                    res.json({ success: true, msg: 'Mail sent successfully.' });
            });

    }


}


module.exports = emailHandler;