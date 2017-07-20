var express = require('express');
cors = require('cors');
morgan = require('morgan');
routes = require('./routes/routes');
bodyParser = require('body-parser');


var app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(routes);


app.listen(3333, function () {
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