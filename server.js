var express = require('express');
var app = express();
var http=require("http");
const url = require('url');
var port = process.env.PORT || 3000;  

app.get('/', function (req, res) {
  res.send("oi");
});

app.get('/proxied_image/:image_url', function(request_from_client, response_to_client){
  console.log("Starting proxy");
  var image_url = request_from_client.params.image_url;
  console.log(request_from_client.params.image_url);
  var image_host_name = url.parse(image_url).hostname;
  console.log(image_host_name);
  var filename = url.parse(image_url).pathname.split("/").pop();

  console.log(filename);

  var image_get_request = http.request({port: 80, method: 'GET',path: image_url, "host": image_host_name});
  image_get_request.addListener('response', function(proxy_response){
    var current_byte_index = 0;
    var response_content_length = parseInt(proxy_response.header("Content-Length"));
    var response_body = new Buffer(response_content_length);
   
    proxy_response.setEncoding('binary');
    proxy_response.addListener('data', function(chunk){
      response_body.write(chunk, current_byte_index, "binary");
      current_byte_index += chunk.length;
    });
    proxy_response.addListener('end', function(){
      response_to_client.contentType(filename);
      response_to_client.send(response_body);
    });
  });
  image_get_request.end();
});


app.listen(port, function () {
 console.log("ligado");
});
