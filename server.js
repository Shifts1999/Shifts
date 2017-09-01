/**
 * Created by idoku on 8/31/2017.
 */
var express = require('express');
global.jQuery = require("jquery");
var app = express();
var path = require('path');
var PORT = process.env.PORT || 3000;

//app.use(express.static(path.join(__dirname, 'public')));

app.all("/*", function (req, res) {
   res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, function() {
   console.log("Server Running on Port " + PORT);
});