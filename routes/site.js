'use strict';

const login = require('connect-ensure-login');

module.exports.about = (request, response) => {
  response.render('about');
};

module.exports.logout = (request, response) => {
  request.logout();
  response.redirect('/');
};

module.exports.login = (request, response) => {
	response.render('../views/login')
}

module.exports.register = (request, response) => {
	response.render('../views/register')
}


module.exports.account = [
  login.ensureLoggedIn(),
  (request, response) => {response.render('account', { user: request.user })},
];
