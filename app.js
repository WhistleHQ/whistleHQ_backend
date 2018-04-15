'use strict';
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const routes = require('./routes');

// Express configuration
const app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandler());

app.use(express.static(__dirname + '/public'));

app.get('/about', routes.site.about);
// app.get('/login', routes.site.loginForm);
// app.get('/login', routes.site.loginForm);
// app.post('/login', routes.site.account);
app.get('/register', routes.site.register);
app.post('/getToken', routes.getToken);
app.post('/signup', routes.register);
// app.get('/logout', routes.site.logout);
// app.get('/account', routes.site.account);

app.post('/api/login', routes.login)
app.post('/api/getToken', routes.getToken)
app.post('/api/register', routes.register)
app.post('/api/putComments', routes.putComment)
app.post('/api/getComments', routes.getComment)

app.listen(process.env.PORT || 3000);
