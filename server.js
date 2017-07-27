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


var VERSIONS = { 'Pre-Production': '/v1' };

app.all('/v1/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.all('/v1/*', [require('./methods/handlers/authhandler')]);

// route to display versions
app.get('/', function (req, res) {
    res.json(VERSIONS);
})
app.use(routes);
app.listen(3333, function () {
    console.log('server is running');
});
//})

//Firebase
