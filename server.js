var express = require('express');
var app = express();
var request=require("request");
var url = require('url');
var port = process.env.PORT || 3000;  

app.get('/', function (req, res) {
  res.send("oi");
});

app.get("/image/:imglink", function(req, res) {
    var requestSettings = {
        url: req.params.imglink,
        method: 'GET',
        encoding: null
    };

    request(requestSettings, function(error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
    });
});


app.listen(port, function () {
 console.log("ligado");
});
