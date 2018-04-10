'use strict';

//We shall save the users locally here
//The keys here are the username
const loggedIn = {};

//If reference by token is required
const loggedInByUsername = {};

//generates random strings
const tokenGen = require('casual');

//we don't want a username called "null" or any other reserved keyword
const isReserved = require('reserved-words');

module.exports.validateToken = (token) => {
  if(typeof token == "string" && loggedIn[token] && loggedInByUsername[loggedIn[token]["username"]]) {
  	return true;
  }	else {
  	return false;
  }
};

//identifier can be token or username
function deleteExistingEntry(identifier) {

	if(loggedIn[identifier]) {
		// If the identifier was a token
		delete loggedInByUsername[loggedIn[identifier]["username"]];
		delete loggedIn[identifier];

	}	else if (loggedInByUsername[identifier]) {
		// if the identifier was a username
		delete loggedIn[loggedInByUsername[identifier]];
		delete loggedInByUsername[identifier]

	}	else {
		return false;
	}

	return true;
}

module.exports.saveSession = (userData) => {

	//Saving session for a user with existing session?
	deleteExistingEntry(userData.username);

	if(isReserved.check(userData.username)) {
		return false;
	}

	const info = Object.assign({}, userData);
	
	//won't need this anymore
	delete info.password;
	info.timestamp = Date.now();

	const token = tokenGen.uuid;
	loggedIn[token] = Object.assign({}, info);

	//This will be used for quick cross-reference
	loggedInByUsername[info.username] = token;

	return token;

}

//Get that token
module.exports.getInfoFromToken = (token) => {
	if(loggedIn[token]) {
		return loggedIn[token];
	}

	return false;
}
