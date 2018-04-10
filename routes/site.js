'use strict';

const login = require('connect-ensure-login');

module.exports.index = (request, response) => response.send('OAuth 2.0 Server <a href="/login">login</a> <a href="/account">account</a>');

module.exports.logout = (request, response) => {
  request.logout();
  response.redirect('/');
};

module.exports.register = (request, response) => {
	response.render('../views/register', {
		"token": request.query.token
	})
}

module.exports.account = [
  login.ensureLoggedIn(),
  (request, response) => {response.render('account', { user: request.user })},
];