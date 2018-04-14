const firebase = require("../auth/firebase.js").fire
const tokenRef = firebase.firestore().collection('tokens');
const userData = firebase.firestore().collection('userdata');
const scrypt = require("scrypt");
const scryptParameters = scrypt.paramsSync(0.2);

module.exports = (req, res, next) => {
	res.setHeader('Content-Type', 'application/json');

	if(req.body.token && req.body.username && req.body.password && req.body.name) {

		let error = [];
		let usernameCheck, tokenCheck, domain = null;

		//Check for weak passwords
		if (req.body.password.length < 10) {
			error.push("Your password is weak, it should have at least 10 characters.");
		}

		//Check for duplicate usernames
		const sameUser = userData.where("username", "==", req.body.username).get()
			.then(snapshot => {
				if (snapshot.size > 0) {
					usernameCheck = false;
					error.push("This username is taken.");
				}	else {
					usernameCheck = true;
				}
			}).catch(err => {
				usernameCheck = false;
				res.send("DB won't work", err); next();
			})

		//Check for a valid token
		const invalidToken = tokenRef.doc(req.body.token).get()
			.then(r => {
				let data = r.data();
				if(data && data.timestamp && Date.now() - data.timestamp > 0 && Date.now() - data.timestamp < 7200000) {
					tokenCheck = true;
					domain = data.domain;
				}	else {
					tokenCheck = false;
					error.push("Your token has expired. Try again");
				}
			})
		
		//When both the conditions are met
		Promise.all([sameUser, invalidToken]).then(() => {
			if(error.length > 0) {
				res.send({ "error": error.join(" ")});
				next();
				return;
			}
			if(usernameCheck && tokenCheck) {
				scrypt.kdf(req.body.password, scryptParameters, function(err, result){
					var setData = userData.add({
						'username': req.body.username,
						'password': result,
						'name': req.body.name,
						'domain': domain
					}).then(() => {
						res.send({
							"success": "userdata saved"
						}) ;next();
					});
				});
			}	else {
				res.send({
					"success": "Something, somewhere went wrong."
				}) ;next();
			}
		})

	} else {
		res.send({
			"error": "incomplete information"
		}) ;next();
	}
}
