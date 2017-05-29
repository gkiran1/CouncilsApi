var firebase = require('firebase');
var https = require('https');
var request = require('request');

var app = firebase.initializeApp({
    apiKey: "AIzaSyDXnywKsXMwYNmHtLjzQZxa52jhWrUAcD0",
    authDomain: "councils-45092.firebaseapp.com",
    databaseURL: "https://councils-45092.firebaseio.com",
    projectId: "councils-45092",
    storageBucket: "councils-45092.appspot.com",
    messagingSenderId: "310008879834"
});

var options = {
    protocol: 'https:',
    hostname: 'fcm.googleapis.com',
    path: '/fcm/send',
    port: 443,
    json: true,
    method: 'POST',
    headers: {
        "content-type": "application/json",
        "Authorization": "key=" + "AAAASC34Gto:APA91bEXDfky2ZWKDfD3Ct-HZgQ06hqN0SO4XMEVYutJArXcy64sLfjAqY6tong21l7yzHEyaA8CERppvBxkGhrP2D5i1nbTDPw-Bxx3rIOeShkJ-nRoZMAbRej-A-X8LvIM10IYpgiO"
    }
};

var rootRef = firebase.database().ref();

var notifications = {

    // Agendas Trigger ------------------------
    agendasTrigger: function () {
        rootRef.child('agendas').endAt().limitToLast(1).on('child_added', function (snapshot) {
            var agendaId = snapshot.getKey();
            var description = snapshot.val()['agendacouncil'];
            var createdBy = snapshot.val()['createdby'];
            var userKeys = [];
            var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(agendaId);
            notificationRef.once("value", function (snap) {
                if (!snap.exists()) {
                    var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
                    councilUsersRef.once('value').then(function (usrsSnapshot) {
                        usrsSnapshot.forEach(usrObj => {
                            var id = usrObj.val()['userid'];
                            userKeys.push(id);
                            if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
                                var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
                                notSettingsRef.once('value', function (notSnap) {
                                    if (notSnap.exists()) {
                                        notSnap.forEach(notSetting => {
                                            if (notSetting.val()['allactivity'] === true || notSetting.val()['agendas'] === true) {
                                                var usrRef = firebase.database().ref().child('users/' + id);
                                                usrRef.once('value').then(function (usrSnapshot) {
                                                    if (usrSnapshot.val()['isactive'] === true) {

                                                        var pushtkn = usrSnapshot.val()['pushtoken'];
                                                        var email = usrSnapshot.val()['email'];

                                                        firebase.database().ref().child('notifications').push({
                                                            userid: id,
                                                            nodeid: agendaId,
                                                            nodename: 'agendas',
                                                            description: description,
                                                            action: 'create',
                                                            text: 'New ' + description + ' agenda posted',
                                                            createddate: new Date().toISOString(),
                                                            createdtime: new Date().toTimeString(),
                                                            createdby: createdBy,
                                                            isread: false
                                                        }).catch(err => {
                                                            console.log('firebase error:' + err);
                                                            throw err
                                                        });
                                                        // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                                                        // console.log(pushtkn);
                                                        // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                                                        if (pushtkn !== undefined) {
                                                            var push = {
                                                                notification: {

                                                                    body: 'New ' + description + ' agenda posted',
                                                                    title: "LDS Councils",
                                                                    sound: "default",
                                                                    icon: "icon"
                                                                },
                                                                content_available: true,
                                                                to: pushtkn,
                                                                priority: 'high'
                                                            };


                                                            //console.log('Body:', JSON.stringify(push));
                                                            options.body = JSON.stringify(push);
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
                                                            req.write(JSON.stringify(push));
                                                            req.end();

                                                        }
                                                    }

                                                });
                                                return true; // to stop the loop.
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
                else {
                    console.log('Snapshot null');
                }
            });
        });
    },

    // Assignments Update & Delete Trigger ------------------------
    agendasUpdateTrigger: function () {
        rootRef.child('agendas').on('child_changed', function (snapshot) {

            var agendaId = snapshot.getKey();
            var description = snapshot.val()['agendacouncil'];
            var createdBy = snapshot.val()['createdby'];
            var editedBy = snapshot.val()['editedby'];
            var userKeys = [];

            var action = '';
            var txt = '';
            var text = '';

            if (snapshot.val()['isactive'] === false) { // condition check order should not change 
                action = 'deleted';
                txt = 'delete';
                text = description + ' agenda ' + 'deleted';
            } else if (snapshot.val()['isactive'] === true) {
                action = 'edited';
                txt = 'edit';
                text = editedBy + ' edited ' + description + ' agenda';
            }

            if (action === 'deleted') {
                var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(agendaId);
                notificationRef.once('value').then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        firebase.database().ref().child('notifications/' + childSnapshot.key).remove();
                    });
                    return true;
                });
            }
            if (action === 'deleted' || action === 'edited') {
                var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(agendaId);
                notificationRef.once("value", function (snap) {
                    if ((snap.exists() && action === 'completed') || (snap.exists() && action === 'deleted') || (snap.exists() && action === 'edited')) {
                        var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
                        councilUsersRef.once('value').then(function (usrsSnapshot) {
                            usrsSnapshot.forEach(usrObj => {
                                var id = usrObj.val()['userid'];
                                userKeys.push(id);
                                if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
                                    var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
                                    notSettingsRef.once('value', function (notSnap) {
                                        if (notSnap.exists()) {
                                            notSnap.forEach(notSetting => {
                                                if (notSetting.val()['allactivity'] === true || notSetting.val()['agendas'] === true) {
                                                    var usrRef = firebase.database().ref().child('users/' + id);
                                                    usrRef.once('value').then(function (usrSnapshot) {
                                                        if (usrSnapshot.val()['isactive'] === true) {

                                                            var pushtkn = usrSnapshot.val()['pushtoken'];

                                                            firebase.database().ref().child('notifications').push({
                                                                userid: id,
                                                                nodeid: agendaId,
                                                                nodename: 'agendas',
                                                                description: description,
                                                                action: txt,
                                                                text: text,
                                                                createddate: new Date().toISOString(),
                                                                createdtime: new Date().toTimeString(),
                                                                createdby: createdBy,
                                                                isread: false
                                                            }).catch(err => {
                                                                throw err
                                                            });

                                                            if (pushtkn !== undefined) {
                                                                var push = {
                                                                    notification: {

                                                                        body: text,
                                                                        title: "LDS Councils",
                                                                        sound: "default",
                                                                        icon: "icon"
                                                                    },
                                                                    content_available: true,
                                                                    to: pushtkn,
                                                                    priority: 'high'
                                                                };


                                                                //console.log('Body:', JSON.stringify(push));
                                                                options.body = JSON.stringify(push);
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
                                                                req.write(JSON.stringify(push));
                                                                req.end();

                                                            }

                                                        }
                                                    });
                                                    return true; // to stop the loop.
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            }
        });
    },

    // Assignments Trigger ------------------------
    assignmentsTrigger: function () {
        rootRef.child('assignments').endAt().limitToLast(1).on('child_added', function (snapshot) {
            var assignmentId = snapshot.getKey();
            var description = snapshot.val()['description'];
            var assignedUser = snapshot.val()['assigneduser'];
            var createdBy = snapshot.val()['createdby'];
            var userKeys = [];
            var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(assignmentId);
            notificationRef.once("value", function (snap) {
                if (!snap.exists()) {
                    var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
                    councilUsersRef.once('value').then(function (usrsSnapshot) {
                        usrsSnapshot.forEach(usrObj => {
                            var id = usrObj.val()['userid'];
                            userKeys.push(id);
                            if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
                                var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
                                notSettingsRef.once('value', function (notSnap) {
                                    if (notSnap.exists()) {
                                        notSnap.forEach(notSetting => {
                                            if (notSetting.val()['allactivity'] === true || notSetting.val()['assignments'] === true) {
                                                var usrRef = firebase.database().ref().child('users/' + id);
                                                usrRef.once('value').then(function (usrSnapshot) {
                                                    if (usrSnapshot.val()['isactive'] === true) {

                                                        var pushtkn = usrSnapshot.val()['pushtoken'];

                                                        firebase.database().ref().child('notifications').push({
                                                            userid: id,
                                                            nodeid: assignmentId,
                                                            nodename: 'assignments',
                                                            description: description,
                                                            action: 'create',
                                                            text: description + ' accepted by ' + assignedUser,
                                                            createddate: new Date().toISOString(),
                                                            createdtime: new Date().toTimeString(),
                                                            createdby: createdBy,
                                                            isread: false
                                                        }).catch(err => {
                                                            throw err
                                                        });

                                                        if (pushtkn !== undefined) {
                                                            var push = {
                                                                notification: {

                                                                    body: description + ' accepted by ' + assignedUser,
                                                                    title: "LDS Councils",
                                                                    sound: "default",
                                                                    icon: "icon"
                                                                },
                                                                content_available: true,
                                                                to: pushtkn,
                                                                priority: 'high'
                                                            };


                                                            //console.log('Body:', JSON.stringify(push));
                                                            options.body = JSON.stringify(push);
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
                                                            req.write(JSON.stringify(push));
                                                            req.end();

                                                        }

                                                    }
                                                });
                                                return true; // to stop the loop.
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            });
        });
    },

    // Assignments Update & Delete Trigger ------------------------
    assignmentsUpdateTrigger: function () {
        rootRef.child('assignments').on('child_changed', function (snapshot) {
            var assignmentId = snapshot.getKey();
            var description = snapshot.val()['description'];
            var createdBy = snapshot.val()['createdby'];
            var completedBy = snapshot.val()['completedby'];
            var userKeys = [];

            var action = '';
            var txt = '';
            var text = '';

            if (snapshot.val()['isactive'] === false) { // condition check order should not change 
                action = 'deleted';
                txt = 'delete';
                text = description + ' deleted';
            } else if (snapshot.val()['isCompleted'] === true) {
                action = 'completed';
                txt = 'update';
                text = completedBy + ' completed ' + description;
            } else if (snapshot.val()['isCompleted'] === false) {
                action = 'edited';
                txt = 'edit';
                text = description + ' edited';
            }

            if (action === 'deleted') {
                var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(assignmentId);
                notificationRef.once('value').then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        firebase.database().ref().child('notifications/' + childSnapshot.key).remove();
                    });
                    return true;
                });
            }
            if (action === 'deleted' || action === 'completed' || action === 'edited') {
                var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(assignmentId);
                notificationRef.once("value", function (snap) {
                    if ((snap.exists() && action === 'completed') || (snap.exists() && action === 'deleted') || (snap.exists() && action === 'edited')) {
                        var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
                        councilUsersRef.once('value').then(function (usrsSnapshot) {
                            usrsSnapshot.forEach(usrObj => {
                                var id = usrObj.val()['userid'];
                                userKeys.push(id);
                                if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
                                    var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
                                    notSettingsRef.once('value', function (notSnap) {
                                        if (notSnap.exists()) {
                                            notSnap.forEach(notSetting => {
                                                if (notSetting.val()['allactivity'] === true || notSetting.val()['assignments'] === true) {
                                                    var usrRef = firebase.database().ref().child('users/' + id);
                                                    usrRef.once('value').then(function (usrSnapshot) {
                                                        if (usrSnapshot.val()['isactive'] === true) {

                                                            var pushtkn = usrSnapshot.val()['pushtoken'];

                                                            firebase.database().ref().child('notifications').push({
                                                                userid: id,
                                                                nodeid: assignmentId,
                                                                nodename: 'assignments',
                                                                description: description,
                                                                action: txt,
                                                                text: text,
                                                                createddate: new Date().toISOString(),
                                                                createdtime: new Date().toTimeString(),
                                                                createdby: createdBy,
                                                                isread: false
                                                            }).catch(err => {
                                                                throw err
                                                            });

                                                            if (pushtkn !== undefined) {
                                                                var push = {
                                                                    notification: {

                                                                        body: text,
                                                                        title: "LDS Councils",
                                                                        sound: "default",
                                                                        icon: "icon"
                                                                    },
                                                                    content_available: true,
                                                                    to: pushtkn,
                                                                    priority: 'high'
                                                                };


                                                                //console.log('Body:', JSON.stringify(push));
                                                                options.body = JSON.stringify(push);
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
                                                                req.write(JSON.stringify(push));
                                                                req.end();

                                                            }

                                                        }
                                                    });
                                                    return true; // to stop the loop.
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            }
        });
    },

    //Council Discussions Trigger ------------------------
    discussionsTrigger: function () {
        rootRef.child('discussions').endAt().limitToLast(1).on('child_added', function (snapshot) {
            var discussionId = snapshot.getKey();
            var description = snapshot.val()['topic'];
            var createdBy = snapshot.val()['createdBy'];
            var councilName = snapshot.val()['councilname'];
            var userKeys = [];
            var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(discussionId);
            notificationRef.once("value", function (snap) {
                if (!snap.exists()) {
                    var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
                    councilUsersRef.once('value').then(function (usrsSnapshot) {
                        usrsSnapshot.forEach(usrObj => {
                            var id = usrObj.val()['userid'];
                            userKeys.push(id);
                            if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
                                var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
                                notSettingsRef.once('value', function (notSnap) {
                                    if (notSnap.exists()) {
                                        notSnap.forEach(notSetting => {
                                            if (notSetting.val()['allactivity'] === true || notSetting.val()['discussions'] === true) {
                                                var usrRef = firebase.database().ref().child('users/' + id);
                                                usrRef.once('value').then(function (usrSnapshot) {
                                                    if (usrSnapshot.val()['isactive'] === true) {

                                                        var pushtkn = usrSnapshot.val()['pushtoken'];

                                                        firebase.database().ref().child('notifications').push({
                                                            userid: id,
                                                            nodeid: discussionId,
                                                            nodename: 'discussions',
                                                            description: description,
                                                            action: 'create',
                                                            text: description + ' created in ' + councilName,
                                                            createddate: new Date().toISOString(),
                                                            createdtime: new Date().toTimeString(),
                                                            createdby: createdBy,
                                                            isread: false
                                                        }).catch(err => {
                                                            throw err
                                                        });

                                                        if (pushtkn !== undefined) {
                                                            var push = {
                                                                notification: {

                                                                    body: description + ' created in ' + councilName,
                                                                    title: "LDS Councils",
                                                                    sound: "default",
                                                                    icon: "icon"
                                                                },
                                                                content_available: true,
                                                                to: pushtkn,
                                                                priority: 'high'
                                                            };


                                                            //console.log('Body:', JSON.stringify(push));
                                                            options.body = JSON.stringify(push);
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
                                                            req.write(JSON.stringify(push));
                                                            req.end();

                                                        }
                                                    }
                                                });
                                                return true; // to stop the loop.
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            });
        });
    },

    // Council Discussions Update Trigger ------------------------
    discussionsUpdateTrigger: function () {
        rootRef.child('discussions').on('child_changed', function (snapshot) {
            if (snapshot.val()['isNotificationReq'] === true) {
                var description = snapshot.val()['topic'];
                var userName = snapshot.val()['lastMsgSentUser'];
                var msg = snapshot.val()['lastMsg'];
                var userKeys = [];
                var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
                councilUsersRef.once('value').then(function (usrsSnapshot) {
                    usrsSnapshot.forEach(usrObj => {
                        var id = usrObj.val()['userid'];
                        userKeys.push(id);
                        if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
                            var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
                            notSettingsRef.once('value', function (notSnap) {
                                if (notSnap.exists()) {
                                    notSnap.forEach(notSetting => {
                                        if (notSetting.val()['allactivity'] === true || notSetting.val()['discussions'] === true) {
                                            var usrRef = firebase.database().ref().child('users/' + id);
                                            usrRef.once('value').then(function (usrSnapshot) {
                                                if (usrSnapshot.val()['isactive'] === true) {

                                                    var pushtkn = usrSnapshot.val()['pushtoken'];

                                                    if (pushtkn !== undefined) {
                                                        var push = {
                                                            notification: {

                                                                body: 'Council Discussion - ' + description + ' - @' + userName + ': ' + msg,
                                                                title: "LDS Councils",
                                                                sound: "default",
                                                                icon: "icon"
                                                            },
                                                            content_available: true,
                                                            to: pushtkn,
                                                            priority: 'high'
                                                        };


                                                        //console.log('Body:', JSON.stringify(push));
                                                        options.body = JSON.stringify(push);
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
                                                        req.write(JSON.stringify(push));
                                                        req.end();

                                                    }


                                                }
                                            });
                                            return true; // to stop the loop.
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
    },

    // Private Discussions Trigger ------------------------
    privateDiscussionsTrigger: function () {
        rootRef.child('privatediscussions').endAt().limitToLast(1).on('child_added', function (snapshot) {
            var privateDiscussionId = snapshot.getKey();
            var description = snapshot.val()['createdUserName'];
            var createdBy = snapshot.val()['createdUserId'];
            var userId = snapshot.val()['otherUserId'];

            var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(privateDiscussionId);
            notificationRef.once("value", function (snap) {
                if (!snap.exists()) {
                    var usrRef = firebase.database().ref().child('users/' + userId);
                    usrRef.once('value').then(function (usrSnapshot) {
                        if (usrSnapshot.val()['isactive'] === true) {

                            var pushtkn = usrSnapshot.val()['pushtoken'];
                            var email = usrSnapshot.val()['email'];

                            // console.log('////////////////////////////////////////////////');
                            // console.log('pushtkn--------->', pushtkn);
                            // console.log('email----------->', email)
                            // console.log('////////////////////////////////////////////////');

                            var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(userId);
                            notSettingsRef.once('value', function (notSnap) {
                                if (notSnap.exists()) {
                                    notSnap.forEach(notSetting => {
                                        if (notSetting.val()['allactivity'] === true || notSetting.val()['pvtdiscussions'] === true) {
                                            firebase.database().ref().child('notifications').push({
                                                userid: userId,
                                                nodeid: privateDiscussionId,
                                                nodename: 'privatediscussions',
                                                description: description,
                                                action: 'create',
                                                text: "<h3>" + "<span class='nottxt-lbl'>" + description + "</span>" + " private discussion invite" + "</h3>",
                                                createddate: new Date().toISOString(),
                                                createdtime: new Date().toTimeString(),
                                                createdby: createdBy,
                                                isread: false
                                            }).catch(err => {
                                                throw err
                                            });

                                            if (pushtkn !== undefined) {
                                                var push = {
                                                    notification: {

                                                        body: description + ' private discussion invite',
                                                        title: "LDS Councils",
                                                        sound: "default",
                                                        icon: "icon"
                                                    },
                                                    content_available: true,
                                                    to: pushtkn,
                                                    priority: 'high'
                                                };


                                                //console.log('Body:', JSON.stringify(push));
                                                options.body = JSON.stringify(push);
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
                                                req.write(JSON.stringify(push));
                                                req.end();

                                            }

                                            return true; // to stop the loop.
                                        }
                                    });
                                }
                            });

                        }
                    });
                }
            });
        });
    },

    // Private Discussions Update Trigger ------------------------
    privateDiscussionsUpdateTrigger: function () {
        rootRef.child('privatediscussions').on('child_changed', function (snapshot) {
            if (snapshot.val()['isNotificationReq'] === true) {
                var description = snapshot.val()['lastMsg']['text'];
                var email = '';
                var name = '';
                var id = '';

                if (snapshot.val()['lastMsg']['userId'] !== snapshot.val()['createdUserId']) {
                    email = snapshot.val()['createdUserEmail'];
                    name = snapshot.val()['otherUserName'];
                    id = snapshot.val()['createdUserId'];
                } else if (snapshot.val()['lastMsg']['userId'] !== snapshot.val()['otherUserId']) {
                    email = snapshot.val()['otherUserEmail'];
                    name = snapshot.val()['createdUserName'];
                    id = snapshot.val()['otherUserId'];
                }

                var usrRef = firebase.database().ref().child('users/' + id);
                usrRef.once('value').then(function (usrSnapshot) {
                    if (usrSnapshot.val()['isactive'] === true) {

                        var pushtkn = usrSnapshot.val()['pushtoken'];

                        var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
                        notSettingsRef.once('value', function (notSnap) {
                            if (notSnap.exists()) {
                                notSnap.forEach(notSetting => {
                                    if (notSetting.val()['allactivity'] === true || notSetting.val()['pvtdiscussions'] === true) {

                                        if (pushtkn !== undefined) {
                                            var push = {
                                                notification: {

                                                    body: 'Private discussion - @' + name + ': ' + description,
                                                    title: "LDS Councils",
                                                    sound: "default",
                                                    icon: "icon"
                                                },
                                                content_available: true,
                                                to: pushtkn,
                                                priority: 'high'
                                            };


                                            //console.log('Body:', JSON.stringify(push));
                                            options.body = JSON.stringify(push);
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
                                            req.write(JSON.stringify(push));
                                            req.end();

                                        }

                                        return true; // to stop the loop.
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    // User Update Trigger ------------------------
    userUpdateTrigger: function () {
        rootRef.child('users').on('child_changed', function (snapshot) {
            var id = snapshot.getKey();
            var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
            notSettingsRef.once('value', function (notSnap) {
                if (notSnap.exists()) {
                    notSnap.forEach(notSetting => {
                        if (notSetting.val()['allactivity'] === true || notSetting.val()['actinactaccount'] === true) {
                            if (snapshot.val()['isnotificationreq'] === true) {

                                var isactive = snapshot.val()['isactive'];
                                var description = '';
                                var pushtkn = snapshot.val()['pushtoken'];

                                if (isactive === false) {
                                    description = 'Your account is deactivated'
                                } else if (isactive === true) {
                                    description = 'Your account is activated'
                                }

                                if (pushtkn !== undefined) {
                                    var push = {
                                        notification: {

                                            body: description,
                                            title: "LDS Councils",
                                            sound: "default",
                                            icon: "icon"
                                        },
                                        content_available: true,
                                        to: pushtkn,
                                        priority: 'high'
                                    };


                                    //console.log('Body:', JSON.stringify(push));
                                    options.body = JSON.stringify(push);
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
                                    req.write(JSON.stringify(push));
                                    req.end();

                                }

                            }
                            return true; // to stop the loop.
                        }
                    });
                }
            });
        });
    },

    // Files Trigger ------------------------
    filesTrigger: function () {
        rootRef.child('files').endAt().limitToLast(1).on('child_added', function (snapshot) {
            var fileId = snapshot.getKey();
            var description = snapshot.val()['councilname'];
            var createdBy = snapshot.val()['createdBy'];
            var createdUser = snapshot.val()['createdUser'];
            var name = snapshot.val()['filename'];
            var userKeys = [];
            var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(fileId);
            notificationRef.once("value", function (snap) {
                if (!snap.exists()) {
                    var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
                    councilUsersRef.once('value').then(function (usrsSnapshot) {
                        usrsSnapshot.forEach(usrObj => {
                            var id = usrObj.val()['userid'];
                            userKeys.push(id);
                            if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
                                var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
                                notSettingsRef.once('value', function (notSnap) {
                                    if (notSnap.exists()) {
                                        notSnap.forEach(notSetting => {
                                            if (notSetting.val()['allactivity'] === true || notSetting.val()['files'] === true) {
                                                var usrRef = firebase.database().ref().child('users/' + id);
                                                usrRef.once('value').then(function (usrSnapshot) {
                                                    if (usrSnapshot.val()['isactive'] === true) {

                                                        var pushtkn = usrSnapshot.val()['pushtoken'];
                                                        var txt = 'New ' + name + ' file uploaded';

                                                        firebase.database().ref().child('notifications').push({
                                                            userid: id,
                                                            nodeid: fileId,
                                                            nodename: 'files',
                                                            description: description,
                                                            action: 'create',
                                                            text: txt,
                                                            createddate: new Date().toISOString(),
                                                            createdtime: new Date().toTimeString(),
                                                            createdby: createdBy,
                                                            isread: false
                                                        }).catch(err => {
                                                            throw err
                                                        });

                                                        if (pushtkn !== undefined) {
                                                            var push = {
                                                                notification: {

                                                                    body: createdUser + ' sent you a file ' + name,
                                                                    title: "LDS Councils",
                                                                    sound: "default",
                                                                    icon: "icon"
                                                                },
                                                                content_available: true,
                                                                to: pushtkn,
                                                                priority: 'high'
                                                            };


                                                            //console.log('Body:', JSON.stringify(push));
                                                            options.body = JSON.stringify(push);
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
                                                            req.write(JSON.stringify(push));
                                                            req.end();

                                                        }

                                                    }
                                                });
                                                return true; // to stop the loop.
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            });
        });
    }

}

module.exports = notifications;