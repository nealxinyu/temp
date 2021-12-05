const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const app = express();

app.set('views', __dirname + '/views')
app.use(express.json());
app.use('/public', static);
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

configRoutes(app);
app.engine('handlebars', exphbs({defaultLayout: 'main' , helpers: require('./server/handlebars-helpers')}));
app.set('view engine', 'handlebars');

app.listen(3000, () => {
  console.log('Your site is running on http://localhost:3000');
});