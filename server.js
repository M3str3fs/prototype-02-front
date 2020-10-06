const express = require('express');
const path = require('path');
require('dotenv').config()
const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/client-web'));

app.get('/*', function(req, res) {

    res.sendFile(path.join(__dirname + '/dist/client-web/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);