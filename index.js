var express = require('express');
var logger = require('morgan');
var path = require('path');
var program = require('commander');
var uuid = require('node-uuid');

var app = express();

function subdomainMiddle(req, res, next) {
    
    var hostParts = req.hostname.split(".");
    if(hostParts.length < 3 || hostParts[0] == "www") {
        res.locals.subdomain = uuid.v1();
    } else {
        req.url = "/subdomain/" + hostParts[0] + req.url;
        res.locals.subdomain = hostParts[0];
    }

    res.locals.subdomainBase = res.locals.subdomain.split('-')[0];
    res.locals.domain = "http://" + res.locals.subdomain + "." + hostnameRoot(req.hostname);
    res.locals.manifest = res.locals.domain + "/manifest.webapp";
    next();
}

function hostnameRoot(hostname) {
    return hostname.split('.').slice(-2).join('.');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(subdomainMiddle);
app.get("/", function(req, res) {
    res.render('index');
});

app.get("/subdomain/:subdomain", function(req, res) {
    res.locals.json = "{}";
    res.render('edit');
});

program
    .option('-p, --port <port>', 'Bind Port', 3000, parseInt)
    .parse(process.argv);

console.log("Listening on:", program.port);
app.listen(program.port);
