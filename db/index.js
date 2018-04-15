'use strict';

const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

//Session expiry in seconds. Default to 2 days
const session_expiry = process.env.SESSION_EXPIRY_TIME || 172800;

//generates random strings
const tokenGen = require('casual');

//we don't want a username called "null" or any other reserved keyword
const isReserved = require('reserved-words');

module.exports.validateToken = (token, cb) => {

  redis.get("token_" + token, (err, result) => {
	  if(err) {
		  cb(false); return;
	  }
	  redis.get("user_"+JSON.parse(result).username, (e, r) => {
		  if(e) {
			  cb(false); return;
		  }
		  cb(true);
		  redis.pipeline()
			  .expire("token_" + token, session_expiry)
			  .expire("user_"+JSON.parse(result).username, session_expiry)
	  })
  })
};

module.exports.saveSession = (userData) => {

	if(isReserved.check(userData.username)) {
		return false;
	}

	const info = Object.assign({}, userData);
	
	//won't need this anymore
	delete info.password;
	info.timestamp = Date.now();

	const token = tokenGen.uuid;

	redis.pipeline()
		//key is the token
		.set("token_"+token, JSON.stringify(info))
		.expire("token_"+token, session_expiry)

		//username is the token
		.set("user_"+info.username, token)
		.expire("user_"+info.username, session_expiry)
		.exec(function(err, result) {
			if(err) {
				console.log("something wrong with server")
			}
		})

	return token;

}

//Get that token
module.exports.getInfoFromToken = (token, cb) => {
	redis.pipeline()
		.get("token_" + token, (err, result) => {
			if(!result) {
				cb(false); return;
			}
			var result_resolve = JSON.parse(result);
			cb(result_resolve);
			redis.expire("user_" + result_resolve.username, session_expiry)
		})
		.expire("token_" + token, session_expiry)
		.exec();
}
