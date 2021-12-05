const express = require('express');
const exphbs = require('express-handlebars');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const app = express();
const handlebarHelper = require('./server/handlebars-helpers')
const cookieParser = require("cookie-parser");

const port = parseInt(process.env['APP_PORT'] || "80");
const appName = process.env['APP_NAME'] || "skillset"

app.set('views', __dirname + '/views')
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/' + appName + '/public', express.static('public'));
app.use(cookieParser());

configRoutes(app);
app.engine('handlebars', exphbs({defaultLayout: 'main' , helpers: handlebarHelper}));
app.set('view engine', 'handlebars');

app.listen(port, '0.0.0.0', function () {
  console.log('Service started at http://0.0.0.0:' + port + '/' + appName + '/');
});