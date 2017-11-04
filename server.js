/******************         Node/Express Setup            ****************/
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require("body-parser");

/*************************  Firebase Admin  **************************/
var admin = require("firebase-admin");

var serviceAccount = require("key/benkyohrapp-firebase-adminsdk-25d6e-9c25f36f7b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://benkyohrapp.firebaseio.com"
});

/*********************Firebase End*****************************/

app.use(cors());
app.use(bodyParser.json()); // <--- Here
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.use("/", express.static(__dirname));

