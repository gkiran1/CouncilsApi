var admin = require("firebase-admin");

var serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://councilsdb.firebaseio.com"
});

module.exports = function(req, res, next) {
 //console.log('Auth request', req);
  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe. 
 
  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next();
 
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  var uid = (req.body && req.body.uid) || (req.query && req.query.uid) || req.headers['x-key'];
  //console.log('token------->', token);
  //console.log('uid--------->', uid);
  if (token || uid) {
    try {
        //console.log('token verification process');
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                //console.log('Decoded----------->', decodedToken);
                //console.log('Current Time----------->',Date.now())
                
        if (decodedToken.exp <= (Date.now())/1000) {
            res.status(400);
            res.json({
            "status": 400,
            "message": "Token Expired"
            });
            return;
        }
                decodedToken.uid;
                //console.log("Uid", decodedToken.uid);
                if (uid === decodedToken.uid) {
                    next();
                }
                else {
                    res.status(401).send({ msg: "Unauthorized request: Invalid token." });
                }
                // ...
            }).catch(function (error) {
                res.status(401).send({ msg: "Unauthorized request: Invalid token."});
                //res.status(401).send({ msg: "Unauthorized request: Invalid token." + error });
            });
        
     
 
      
    } catch (err) {
      res.status(500);
      res.json({
        "status": 500,
        "message": "Oops something went wrong",
        "error": err
      });
    }
  } else {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid Token or Key"
    });
    return;
  }
};
