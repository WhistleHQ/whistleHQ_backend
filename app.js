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

app.get('/', routes.site.index);
app.get('/logout', routes.site.logout);
app.get('/account', routes.site.account);
app.get('/register', routes.site.register);

app.post('/api/login', routes.login)
app.post('/api/getToken', routes.getToken)
app.post('/api/register', routes.register)
app.post('/api/putComments', routes.putComment)
app.post('/api/getComments', routes.getComment)

app.listen(process.env.PORT || 3000);
