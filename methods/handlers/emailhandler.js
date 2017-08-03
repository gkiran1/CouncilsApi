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
            case 'inviteadmin':
                this.inviteAdmin(req, res);
                break;

        }
    },
    invite : function (req, res) {
        var emailText = "Dear " + req.body.firstname + ",\n\nYour Councils account is active.  Please download the app for full access to your unit #" + req.body.unitnum + ".";
        var androidLink = "http://google.com";
        var iosLink = "http://apple.com";
        var subject = "Welcome to Councils"
        // var emailHtml = "Dear " + req.body.firstname + ",<br><br>Your Councils account is active.  Please download the app for full access to your unit #" + req.body.unitnum + ". "
        //     + "<br><br><table border='0' cellpadding='10' cellspacing='0' style='border-collapse:collapse'><tr><td> <a href='" + iosLink + "'><img src='cid:appstore' width='200' height='60' /></a></td>"
        //     + "<td><a href='" + androidLink + "'><img src='cid:playstore' width='236' height='92' /></a></td></tr></table><br><br>**********";

        var emailHtml = `<div style="font-family:Helvetica"><p>${req.body.name},</p>
            <p><span style="color:#32b38a">${req.body.adminname}</span> has invited you to the Councils platform.</p>
            <p><b>Features on Councils</b><br />&nbsp; &nbsp; &ndash; Create agendas<br />&nbsp; &nbsp; &ndash; Start council or private discussions<br
                />&nbsp; &nbsp; &ndash; Add assignments<br />&nbsp; &nbsp; &ndash; Post council files<br /></p>
            <p><b>Download the app then register an account</b><br />Use <a href='mailto:${req.body.email}' style="color:#32b38a;text-decoration:none">${req.body.email}</a> as your email, then choose your own password.</p>
            <p><b>Download the app for iPhone or Android </b><br /><a href='${iosLink}' style="color:#32b38a;text-decoration:none; font-size:150%;">App Store</a> / <a href="${androidLink}" style="color:#32b38a;text-decoration:none;font-size:150%;">Google Play</a></p>
            <p>If you have questions please email us as <a href='mailto:hello@councils.io' style="color:#32b38a;text-decoration:none">hello@councils.io</a></p>
            <p>Copyright (C) 2017 Councils Inc. All rights reserved.</p></div>`
            
            var attachment = [
                { data: emailHtml, alternative: true }
            ];

        this.send(res, req.body.email, subject, emailHtml, attachment);
    },

    accountCreated : function (req, res) {
        var subject = req.body.firstname + ", welcome to Councils!"
        var emailHtml = "<div style='font-family:Helvetica'>"+req.body.firstname + ", welcome to Councils!<br>You are now a member of unit #" + req.body.unitnum + ". "
            + "<br><br>Account Details<br><br>"
            + req.body.firstname + " " + req.body.lastname + "<br><br>"
            + "<a href='mailto:"+req.body.email+"'  style='color:#32b38a;text-decoration:none'>"+req.body.email+"</a>"
            + "<br><br>These are the features you have access to as a member."
            +"<br><br>"
            +"&nbsp; &nbsp; &ndash; Create Agendas.<br>"
            +"&nbsp; &nbsp; &ndash; Start council or private discussions.<br>"
            +"&nbsp; &nbsp; &ndash; Add Assignments.<br>"
            +"&nbsp; &nbsp; &ndash; Post councils files.<br>"
            +"<br><br>If you have questions please email us at <a href='mailto:hello@councils.io'  style='color:#32b38a;text-decoration:none'>hello@councils.io</a>"
            +"<br><br>Copyright (C) 2017 Councils Inc. All rights reserved.</div>";
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
            +"\n\nCopyright (C) 2017 Councils Inc. All rights reserved.";

            var attachment = [
                { data: emailHtml, alternative: true }
                
            ];

        this.send(res, req.body.email, subject, emailHtml, attachment);
        
    },

    forgotPassword : function (req, res) {



        var subject = "Forgot Password"
        var emailHtml = req.body.name + ", <br><br>please click on below link to change your password."
            +"<br><br><a href='https://councils-signup.firebaseapp.com/resetpwd'>Reset Password</a>"
            +"<br><br>If you have questions please email us at hello@councils.io"
            +"<br><br>Copyright (C) 2017 Councils Inc. All rights reserved.";
        var emailText = req.body.name + ", <br><br>please click on below link to change your password."
            + "\n\nwww.councils.io" 
            +"\n\nIf you have questions please email us at <a href='mailto:hello@councils.io'>hello@councils.io</a>"
            +"\n\nCopyright (C) 2017 Councils Inc. All rights reserved.";
        var attachment = [
                { data: emailHtml, alternative: true }
                
            ];

        this.send(res, req.body.email, subject, emailText, attachment);
    }, 
    
    accountInactivated : function (req, res) {
        var subject = "Goodbye From Councils"
        var emailHtml = "<div style='font-family:Helvetica'>" + req.body.name + ","
            +"<br><br>Your account has been inactived by <span style='color:#32b38a'>"+req.body.adminname+"</span>."
            +"<br><br>If you have questions please email us at <a href='mailto:hello@councils.io' style='color:#32b38a;text-decoration:none'>hello@councils.io</a>"
            +"<br><br>For future access to Councils in another calling, remember to log in using <a href='mailto:"+ req.body.email +"'>"+ req.body.email +"</a> as your email."
            +"<br><br>Copyright (C) 2017 Councils Inc. All rights reserved.</div>";
        var emailText = "<div style='font-family:Helvetica'>" + req.body.name + ","
            +"\n\nYour account has been inactived by "+req.body.adminname+"."
            +"\n\nIf you have questions please email us at hello@councils.io"
            +"\n\nCopyright (C) 2017 Councils Inc. All rights reserved.";
        
        var attachment = [
                { data: emailHtml, alternative: true }
                
            ];

        this.send(res, req.body.email, subject, emailHtml, attachment);
    }, 
    
    accountReactivated : function (req, res) {
        var subject = "Welcome back to Councils"
        var emailHtml = "<div style='font-family:Helvetica'>" + req.body.name + ","
            +"<br><br>Your Councils account has been re-activated by <span style='color:#32b38a'>"+req.body.adminname+"</span>."
            +"<br><br>Re-download the app or sign back in using the email <a style='color:#32b38a;text-decoration:none' href='mailto:"+req.body.email+"'>"+req.body.email+"</a> and the password you created."
            +"<br><br>If you have questions please email us at <a href='mailto:hello@councils.io'  style='color:#32b38a;text-decoration:none'>hello@councils.io</a>"
            +"<br><br>Copyright (C) 2017 Councils Inc. All rights reserved.</div>";
        var emailText = req.body.name + ","
            +"\n\nYour Councils account has been re-activated by "+req.body.adminname+"."
            + "\n\nRe-download the app or sign back in using the email "+req.body.email+" and the password you created."
            +"\n\nIf you have questions please email us at hello@councils.io"
            +"\n\nCopyright (C) 2017 Councils Inc. All rights reserved.";
        
        var attachment = [
                { data: emailHtml, alternative: true }
                
            ];

        this.send(res, req.body.email, subject, emailHtml, attachment);
    },

    adminCreated : function(req, res) {
        var subject = "Welcome to Councils"
        // var emailHtml = req.body.firstname + ", welcome to Councils!<br>You've registered your  unit #" + req.body.unitnum + " on Councils. You are the account administrator."
        //     + "<br><br>Account Details<br><br>"
        //     + req.body.firstname + " " + req.body.lastname + "<br>"
        //     + req.body.email
        //     + "<br><br>These are the features you have access to as a member."
        //     +"<ul>"
        //     +"<li>Create Agendas.</li>"
        //     +"<li>Start council or private discussions.</li>"
        //     +"<li>Add Assignments.</li>"
        //     +"<li>Post councils files.</li>"
        //     +"</ul>"
        //     +"<br><br>If you have questions please email us at <a href='mailto:hello@councils.io'>hello@councils.io</a>"
        //     +"<br><br>Councils Foundation 501(C)(3) Salt Lake City Utah";
        var emailHtml = `<div style='font-family:Helvetica'><p>${req.body.firstname} ${req.body.lastname},</p>
            <p>You&rsquo;ve registered your unit #${req.body.unitnum} on Councils. You are the account administrator.</p>
            <p><b>Account admin features</b><br />&nbsp; &nbsp; &ndash; Invite members<br />&nbsp; &nbsp; &ndash; Member access to which councils<br
                />&nbsp; &nbsp; &ndash; View active councils<br />&nbsp; &nbsp; &ndash; Create new councils<br />&nbsp; &nbsp; &ndash;
                Inactivate members<br />&nbsp; &nbsp; &ndash; Edit members access<br />&nbsp; &nbsp; &ndash; Re-activate members<br />&nbsp;
                &nbsp; &ndash; Transfers admin rights<br />&nbsp; &nbsp; &ndash; View completed assignments</p>
            <p><b>Download the app then register an account</b><br />Use <a href='mailto:${req.body.email}' style="color:#32b38a;text-decoration:none">${req.body.email}</a> as your email, then choose your own password.</p>
            <p><b>Download the app for iPhone or Android </b><br /><a href='wwww.apple.com' style="color:#32b38a;text-decoration:none; font-size:150%;">App Store</a> / <a href="wwww.google.com" style="color:#32b38a;text-decoration:none;font-size:150%;">Google Play</a></p>
            <p>If you have questions please email us as <a href='mailto:hello@councils.io' style="color:#32b38a;text-decoration:none">hello@councils.io</a></p>
            <p>Copyright (C) 2017 Councils Inc. All rights reserved.</p> </div>`

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
            +"\n\nCopyright (C) 2017 Councils Inc. All rights reserved.";

        var attachment = [
                { data: emailHtml, alternative: true }
                
            ];

        this.send(res, req.body.email, subject, emailHtml, attachment);
    },
    unitMissing : function(req, res) {
        var subject = "Missing Unit #"+ req.body.unitnum
        var emailHtml = "Dear Admin,"
            + "<br><br>A new unit #"+req.body.unitnum+" is requested to be added to Councils."
           
            +"<br><br>Copyright (C) 2017 Councils Inc. All rights reserved.";
        var emailText = "Dear Admin,"

            + "\n\nA new unit #"+req.body.unitnum+" is request to be added to Councils."
           
            +"\n\nCopyright (C) 2017 Councils Inc. All rights reserved.";

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
            +"<br><br>Copyright (C) 2017 Councils Inc. All rights reserved.";
        var emailText = req.body.firstname + "Dear Admin,"
            + "\n\nA new member has requested to be added to Councils\n\n"
            + "Details:\n\n"
            +"Unit #"+req.body.unitnum+"\n"
             +"Name: "+req.body.name + "\n"
            + "Email: "+req.body.email
           
            +"\n\nCopyright (C) 2017 Councils Inc. All rights reserved.";

        var attachment = [
                { data: emailHtml, alternative: true }
                
            ];

        this.send(res, "admin@councils.io", subject, emailText, attachment);
    },
    adminTransfered : function(req, res) {
        var subject = "Councils Admin Transferred"
        var emailHtml = "<div style='font-family:Helvetica'>" + req.body.firstname+" "+ req.body.lastname  + ","
            +"<br><br>You transferred admin rights of unit# "+req.body.unitnum+" to <span style='color:#32b38a'>"+req.body.adminfirstname+" "+req.body.adminlastname+"</span>."
            +"<br><br>For future access to Councils in another calling, remember to log in using <a style='color:#32b38a;text-decoration:none' href='mailto:"+ req.body.email +"'>"+ req.body.email +"</a> as your email"
            +"<br><br>If you have questions please email us at <a href='mailto:hello@councils.io' style='color:#32b38a;text-decoration:none'>hello@councils.io</a>"
            +"<br><br>Copyright (C) 2017 Councils Inc. All rights reserved.</div>";
        var emailText = req.body.firstname+" "+ req.body.lastname  + ","
            + "\n\nYou transferred admin rights of unit# "+req.body.unitnum+" to <span style='color:#32b38a'>"+req.body.adminfirstname+" "+req.body.adminlastname+"</span>."
            +"\n\nFor future access to Councils in another calling, remember to log in using <a href='mailto:"+ req.body.email +"'>"+ req.body.email +"</a> as your email"
            +"\n\nIf you have questions please email us at hello@councils.io"
            +"\n\nCopyright (C) 2017 Councils Inc. All rights reserved.";

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

    },
    inviteAdmin: function(req, res){
         var subject = "Welcome to Councils"
         var emailHtml = `<div style="font-family:Helvetica">
            <p>${req.body.name},</p>
            <p><span style="color:#32b38a">${req.body.adminname}</span> has invited you to the Councils platform.</p>
            <p>Using Councils, you and <span style="color:#32b38a">${req.body.adminname}</span> will be able to extend council communication and ministry into everyday life.</p>
            <p><b>Click on this link to sign up</b><br /><a href='https:/signup.councils.io' target="_blank" style="color:#32b38a;text-decoration:none;">signup.councils.io</a></p>
            <p><b>Councils core features</b><br />&nbsp; &nbsp; &ndash; Post agendas<br />&nbsp; &nbsp; &ndash; Start discussions<br />&nbsp; &nbsp; &ndash; Create assignments<br />&nbsp; &nbsp; &ndash; Add files</p>
            <p>If you have questions please email us as <a href='mailto:hello@councils.io' style="color:#32b38a;text-decoration:none">hello@councils.io</a></p>
            <p>Copyright (C) 2017 Councils Inc. All rights reserved.</p></div>`
            
            var attachment = [
                { data: emailHtml, alternative: true }
            ];

        this.send(res, req.body.email, subject, emailHtml, attachment);
    } 


}


module.exports = emailHandler;