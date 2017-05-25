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
            case 'admincreated':
                this.adminCreated(req, res);
                break;
            case 'unitmissing':
                this.unitMissing(req, res);
                break;
            case 'unitadminexist':
                this.unitAdminExist(req, res);
                break;

        }
    },
    invite : function (req, res) {
        var emailText = "Dear " + req.body.firstname + ",\n\nYour Councils account is active.  Please download the app for full access to your unit #" + req.body.unitnum + ".";
        var androidLink = "http://google.com";
        var iosLink = "http://apple.com";
        var subject = "Welcome to Councils!"
        var emailHtml = "Dear " + req.body.firstname + ",<br><br>Your Councils account is active.  Please download the app for full access to your unit #" + req.body.unitnum + ". "
            + "<br><br><table border='0' cellpadding='10' cellspacing='0' style='border-collapse:collapse'><tr><td> <a href='" + iosLink + "'><img src='cid:appstore' width='200' height='60' /></a></td>"
            + "<td><a href='" + androidLink + "'><img src='cid:playstore' width='236' height='92' /></a></td></tr></table><br><br>**********";
            var attachment = [
                { data: emailHtml, alternative: true },
                { path: "./img/playstore-badge.png", type: "image/png", headers: { "Content-ID": "<playstore>" } },
                { path: "./img/appstore-badge.png", type: "image/png", headers: { "Content-ID": "<appstore>" } }
            ];

        this.send(res, req.body.email, subject, emailText, attachment);
    },

    accountCreated : function (req, res) {
        var subject = req.body.firstname + ", welcome to Councils!"
        var emailHtml = req.body.firstname + ", welcome to Councils!<br>You are now a member of unit #" + req.body.unitnum + ". "
            + "<br><br>Account Details<br><br>"
            + req.body.firstname + " " + req.body.lastname + "<br>"
            + req.body.email
            + "<br><br>These are the features you have access to as a member."
            +"<ul>"
            +"<li>Create Agendas.</li>"
            +"<li>Start council or private discussions.</li>"
            +"<li>Add Assignments.</li>"
            +"<li>Post councils files.</li>"
            +"</ul>"
            +"<br><br>If you have questions please email us at <a href='mailto:hello@councils.io'>hello@councils.io</a>"
            +"<br><br>Councils Foundation 501 (c)(3) Salt Lake City Utah";
        var emailText = req.body.firstname + ", Welcome to Councils!<br>You are now a member of unit # " + req.body.unitnum + ". "
            + "\n\nAccount Details\n\n"
            + req.body.firstname + " " + req.body.lastname + "\n"
            + req.body.email
            + "\n\nThese are the features you have access to as a member."
            +"\n"
            +"- Create Agendas.\n"
            +"- Start council or private discussions.\n"
            +"- Add Assignments.\n"
            +"- Post councils files.\n"
            +"\n\nIf you have questions please email us at hello@councils.io"
            +"\n\nCouncils Foundation 501 (c)(3) Salt Lake City Utah";

            var attachment = [
                { data: emailHtml, alternative: true }
                
            ];

        this.send(res, req.body.email, subject, emailText, attachment);
        
    },

    forgotPassword : function (req, res) {



        var subject = req.body.firstname + ", let's change your password!"
        var emailHtml = req.body.firstname + ", please click on below link to change your password."
            +"<br><br><a href='https://councils-signup.firebaseapp.com/resetpwd'>Reset Password</a>"
            +"<br><br>If you have questions please email us at hello@councils.io"
            +"<br><br>Councils Foundation 501(C)(3) Salt Lake City Utah";
        var emailText = req.body.firstname + ", please click on below link to change your password."
            + "\n\nwww.councils.io" 
            +"\n\nIf you have questions please email us at <a href='mailto:hello@councils.io'>hello@councils.io</a>"
            +"\n\nCouncils Foundation 501(C)(3) Salt Lake City Utah";
        var attachment = [
                { data: emailHtml, alternative: true }
                
            ];

        this.send(res, req.body.email, subject, emailText, attachment);
    }, 
    
    accountInactivated : function (req, res) {
        var subject = req.body.firstname + ", your account in inactive"
        var emailHtml = req.body.firstname + ", your account in inactive. Thank you for your dedicated service to the Lord."
            +"<br><br>Please remember your account credentials for future access to Councils in another calling."
             + "<br><br>Account Details<br><br>"
            + req.body.firstname + " " + req.body.lastname + "<br>"
            + req.body.email
            +"<br><br>If you have questions please email us at <a href='mailto:hello@councils.io'>hello@councils.io</a>"
            +"<br><br>Councils Foundation 501(C)(3) Salt Lake City Utah";
        var emailText = req.body.firstname + ", your account in inactive. Thank you for your dedicated service to the Lord."
            +"\n\nPlease remember your account credentials for future access to Councils in another calling."
             + "\n\nAccount Details\n\n"
            + req.body.firstname + " " + req.body.lastname + "\n"
            + req.body.email
            +"\n\nIf you have questions please email us at hello@councils.io"
            +"\n\nCouncils Foundation 501(C)(3) Salt Lake City Utah";
        
        var attachment = [
                { data: emailHtml, alternative: true }
                
            ];

        this.send(res, req.body.email, subject, emailText, attachment);
    }, 
    
    accountReactivated : function (req, res) {
        var subject = req.body.firstname + ", welcome back to Councils!"
        var emailHtml = req.body.firstname + ", welcome back to Councils, your account has been re-activated!"
            +"<br><br>You are now a member of unit #" + req.body.unitnum + ". "
            + "<br><br>Account Details<br><br>"
            + req.body.firstname + " " + req.body.lastname + "<br>"
            + req.body.email
            + "<br><br>These are the features you have access to as a member."
            +"<ul>"
            +"<li>Create Agendas.</li>"
            +"<li>Start council or private discussions.</li>"
            +"<li>Add Assignments.</li>"
            +"<li>Post councils files.</li>"
            +"</ul>"
            +"<br><br>If you have questions please email us at <a href='mailto:hello@councils.io'>hello@councils.io</a>"
            +"<br><br>Councils Foundation 501(C)(3) Salt Lake City Utah";
        var emailText = req.body.firstname + ", welcome back to Councils, your account has been re-activated!"
            +"\n\nYou are now a member of unit #" + req.body.unitnum + ". "
            + "\n\nAccount Details\n\n"
            + req.body.firstname + " " + req.body.lastname + "\n"
            + req.body.email
            + "\n\nThese are the features you have access to as a member."
            +"\n"
            +"- Create Agendas.\n"
            +"- Start council or private discussions.\n"
            +"- Add Assignments.\n"
            +"- Post councils files.\n"
            +"\n\nIf you have questions please email us at hello@councils.io"
            +"\n\nCouncils Foundation 501 (C)(3) Salt Lake City Utah";
        
        var attachment = [
                { data: emailHtml, alternative: true }
                
            ];

        this.send(res, req.body.email, subject, emailText, attachment);
    },

    adminCreated : function(req, res) {
        var subject = "Unit #"+ req.body.unitnum + "on Councils: New Account Details"
        var emailHtml = req.body.firstname + ", welcome to Councils!<br>You've registered your  unit #" + req.body.unitnum + " on Councils. You are the account administrator."
            + "<br><br>Account Details<br><br>"
            + req.body.firstname + " " + req.body.lastname + "<br>"
            + req.body.email
            + "<br><br>These are the features you have access to as a member."
            +"<ul>"
            +"<li>Create Agendas.</li>"
            +"<li>Start council or private discussions.</li>"
            +"<li>Add Assignments.</li>"
            +"<li>Post councils files.</li>"
            +"</ul>"
            +"<br><br>If you have questions please email us at <a href='mailto:hello@councils.io'>hello@councils.io</a>"
            +"<br><br>Councils Foundation 501(C)(3) Salt Lake City Utah";
        var emailText = req.body.firstname + ", welcome to Councils!<br>You've registered your  unit #" + req.body.unitnum + " on Councils. You are the account administrator."
            + "\n\nAccount Details\n\n"
            + req.body.firstname + " " + req.body.lastname + "\n"
            + req.body.email
            + "\n\nThese are the features you have access to as a member."
            +"\n"
            +"- Create Agendas.\n"
            +"- Start council or private discussions.\n"
            +"- Add Assignments.\n"
            +"- Post councils files.\n"
            +"\n\nIf you have questions please email us at hello@councils.io"
            +"\n\nCouncils Foundation 501(C)(3) Salt Lake City Utah";

        var attachment = [
                { data: emailHtml, alternative: true }
                
            ];

        this.send(res, req.body.email, subject, emailText, attachment);
    },
    unitMissing : function(req, res) {
        var subject = "Missing Unit #"+ req.body.unitnum
        var emailHtml = "Dear Admin,"
            + "<br><br>A new unit #"+req.body.unitnum+" is requested to be added to Councils."
           
            +"<br><br>Councils Foundation 501(C)(3) Salt Lake City Utah";
        var emailText = "Dear Admin,"

            + "\n\nA new unit #"+req.body.unitnum+" is request to be added to Councils."
           
            +"\n\nCouncils Foundation 501(C)(3) Salt Lake City Utah";

        var attachment = [
                { data: emailHtml, alternative: true }
                
            ];

        this.send(res, "admin@councils.io", subject, emailText, attachment);
    },
    unitAdminExist : function(req, res) {
        var subject = "New member add request on Councils"
        var emailHtml = "Dear Admin,"
            + "<br><br>A new member has requested to be added to Councils<br><br>"
            + "Details:<br><br>"
            + "Unit #" + req.body.unitnum + "<br>"
            +"Name: " + req.body.name + "<br>"
            + "Email: "+ req.body.email
            +"<br><br>Councils Foundation 501(C)(3) Salt Lake City Utah";
        var emailText = req.body.firstname + "Dear Admin,"
            + "\n\nA new member has requested to be added to Councils\n\n"
            + "Details:\n\n"
            +"Unit #"+req.body.unitnum+"\n"
             +"Name: "+req.body.name + "\n"
            + "Email: "+req.body.email
           
            +"\n\nCouncils Foundation 501(C)(3) Salt Lake City Utah";

        var attachment = [
                { data: emailHtml, alternative: true }
                
            ];

        this.send(res, "admin@councils.io", subject, emailText, attachment);
    },
    adminTransfered : function(req, res) {
        var subject = "Unit #"+req.body.unitnum+" on Councils: Admin rights transferred"
        var emailHtml = req.body.firstname + ", you have transferred admin rights."
            +"<br><br>Unit #"+req.body.unitnum+" on Councils has been transferred to "+req.body.adminfirstname+" "+req.body.adminlastname+". Thank you for your dedicated service to the Lord."
            +"<br><br>Please remember your account credentials for future access to Councils in another calling."
             + "<br><br>Account Details<br><br>"
            + req.body.firstname + " " + req.body.lastname + "<br>"
            + req.body.email
            +"<br><br>If you have questions please email us at <a href='mailto:hello@councils.io'>hello@councils.io</a>"
            +"<br><br>Councils Foundation 501(C)(3) Salt Lake City Utah";
        var emailText = req.body.firstname + ", you have transferred admin rights."
            + "\n\nUnit #"+req.body.unitnum+" on Councils has been transferred to "+req.body.adminfirstname+" "+req.body.adminlastname+". Thank you for your dedicated service to the Lord."
            +"\n\nPlease remember your account credentials for future access to Councils in another calling."
             + "\n\nAccount Details\n\n"
            + req.body.firstname + " " + req.body.lastname + "\n"
            + req.body.email
            +"\n\nIf you have questions please email us at hello@councils.io"
            +"\n\nCouncils Foundation 501(C)(3) Salt Lake City Utah";

        var attachment = [
                { data: emailHtml, alternative: true }
                
            ];


        this.send(res, req.body.email, subject, emailText, attachment);
    },

    councilsEdited : function(req) {

    },    

    send : function(res, to, subject, bodytext, attachment) {
       
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

                from: "Admin <"+config.from+">",
                to: to,
                subject: subject,
                
                
            };
        
        if(attachment && attachment !== undefined)
            headers.attachment = attachment;

        
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