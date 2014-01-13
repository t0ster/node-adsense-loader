var http = require('http');
var fs = require('fs');
var url = require("url");
var path = require('path');
var restify = require('restify');

var httpPort = 8080;
var ApiServerPost = 8888;

var getFilePath = function(url) {
  var filePath = url;
  if (url == '/' ) filePath = './index.html';

  console.log("url: " + url)
  return filePath;
}

var getContentType = function(filePath) {
   var extname = path.extname(filePath);
   var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
    return contentType;
}

var sendHTML = function( filePath, contentType, response ){
  console.log('sendHTML: ' + filePath) ;
  path.exists(filePath, function( exists ) {
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
}

var getAdjs = function(request, response, next) {
    console.log('Ad Feed load');
    response.header( 'Access-Control-Allow-Origin', '*' );
    response.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
    response.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-File-Name, Content-Type, Cache-Control' );
    // if( 'OPTIONS' == req.method ) {
        // response.send( 203, 'OK' );
      // }
    // var item = {id:1, script:"console.log('Lets Do a Funky Bussines')"};
      var code = [
    "<script async type=\"text/javascript\" src=\"http://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\">",
        "<\/script>",
        "<ins class=\"adsbygoogle\"",
         "style=\"display:inline-block;width:336px;height:280px\"",
         "data-ad-client=\"ca-pub-5766101565922238\"",
         "data-ad-slot=\"5407840996\"></ins>",
    "<script>",
    "(adsbygoogle = window.adsbygoogle || []).push({});",
    "<\/script>"];
    var item = {};
    item.script = code;
    response.send(item);
}

var onHtmlRequestHandler = function(request, response) {
  console.log('onHtmlRequestHandler... request.url: ' + request.url) ;
  var filePath = getFilePath(request.url);
  var contentType = getContentType(filePath);
  console.log('onHtmlRequestHandler... getting: ' + filePath) ;
  sendHTML(filePath, contentType, response);
}
var ApiServer = restify.createServer();
// {
//     formatters: {
//         'application/json': function(req, res, body){
//             console.log(req.params);
//             if(req.params.callback){
//                 var callbackFunctionName = req.params.callback.replace(/[^A-Za-z0-9_\.]/g, '');
//                 return callbackFunctionName + "(" + JSON.stringify(body) + ");";
//             } else {
//                 return JSON.stringify(body);
//             }
//         },
//         'text/html': function(req, res, body){
//             return body;
//         }
//     }
// });
ApiServer.use(restify.bodyParser());
ApiServer.listen(ApiServerPost, function() {

  var consoleMessage = '\n ApiServer Running'

  console.log(consoleMessage, ApiServer.name, ApiServer.url);

});

ApiServer.get('/adfeed', getAdjs);
http.createServer(onHtmlRequestHandler).listen(httpPort);
