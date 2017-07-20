var express = require('express');
cors = require('cors');
morgan = require('morgan');
//config = require('./config/database');
//passport = require('passport');
routes = require('./routes/routes');
bodyParser = require('body-parser');
var notificationsRef = require('./methods/handlers/notifications');


//mongoose.connect(config.database);

//mongoose.connection.on('open', function(){
//console.log('Mongo is connected');
var app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(routes);
//app.use(passport.initialize());
//require('./config/passport')(passport);

app.listen(8080, function () {
    // notificationsRef.agendasTrigger();
    // notificationsRef.agendasUpdateTrigger();
    // notificationsRef.assignmentsTrigger();
    // notificationsRef.assignmentsUpdateTrigger();
    // notificationsRef.discussionsTrigger();
    // notificationsRef.discussionsUpdateTrigger();
    // notificationsRef.privateDiscussionsTrigger();
    // notificationsRef.privateDiscussionsUpdateTrigger();
    // notificationsRef.userUpdateTrigger();
    // notificationsRef.filesTrigger();
    console.log('server is running');
})
//})

//Firebase
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://councilsdb.firebaseio.com"
});