var express = require('express');
var logger = require('morgan');
var path = require('path');
var program = require('commander');
var app = express();

function subdomainMiddle(req, res, next) {
    
    var hostParts = req.hostname.split(".");
    if(hostParts.length < 3 || hostParts[0] == "www") {
        next();
        return;
    }

    req.url = "/subdomain/" + hostParts[0] + request.url;
    next();
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(subdomainMiddle);
app.get("/", function(req, res) {
    res.render('index');
});

program
    .option('-p, --port <port>', 'Bind Port', 3000, parseInt)
    .parse(process.argv);

console.log("Listening on:", program.port);
app.listen(program.port);
