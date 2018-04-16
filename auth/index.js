const firebase = require('./firebase.js').fire

//scrypt is used for matching passwords
const scrypt = require("scrypt");
const scryptParameters = scrypt.paramsSync(0.2);

//This "userdata" is where the user details are saved on the server
const userRef = firebase.firestore().collection('userdata');

const localdb = require('../db');


module.exports.check = (req, res, next) => {
	if(req.body.token) {

			localdb.validateToken(req.body.token, (result) => {
				if(result) {
					next();
				}	else {
					res.send({
						"error": "invalid token"
					})
				}
			})
		
		// The user details were not found in the local cache, proceed to call the server to get the details
		} else if(req.body.username && req.body.password) {
			//GraphSQL like queries. Thanks to firestore
			const query = userRef.where('username', '==', req.body.username);

			query.get().then(doc => {
				var data = null;
				debugger;

				//The response from firestore is in a weird format
				try {
					doc.forEach(r => {
						data = r.data();
						data.id = r.id;
					})

					//name, username, password and token acquired
					scrypt.verifyKdf(
						data.password,
						req.body.password,
						(err, result) => {
							if(err) {
								req.body.token = false;
								console.log("wrong password entered");
							}

							if(result) {
								//Generate a token for the successfully logged in user
								req.body.token = localdb.saveSession(data);
								req.body.user = Object.assign({}, {
									"username": data.username,
									"name" : data.name
								});
								res.cookie('token', req.body.token);

							}	else {
								req.body.token = false;
								console.log("wrong password entered");
							}
							next();
						}
						);

				} catch(err) {
					console.log(err);
					req.body.token = false;;
					next();
				}
			})
		}
			else {
			req.body.token = false;
			next();
		}

	}