const firebase = require("../auth/firebase.js").fire
const tokenRef = firebase.firestore().collection('tokens');
const userData = firebase.firestore().collection('userdata');
const scrypt = require("scrypt");
const scryptParameters = scrypt.paramsSync(0.2);

module.exports = [(req, res, next) => {
	res.setHeader('Content-Type', 'application/json');

	if(req.body.token && req.body.username && req.body.password && req.body.name) {
		//check for duplicate usernames
		try {
			var token = tokenRef.doc(req.body.token);
			token.get().then(r => {

				var data = r.data();

	    //check if timestamp is within 2hours
	    if(data && data.timestamp && Date.now() - data.timestamp > 0 && Date.now() - data.timestamp < 7200000) {
	    	scrypt.kdf(req.body.password, scryptParameters, function(err, result){
	    		var setData = userData.add({
	    			'username': req.body.username,
	    			'password': result,
	    			'name': req.body.name,
	    			'domain': data.domain
	    		}).then(() => {
	    			res.send({
	    				"success": "userdata saved"
	    			}) ;next();
	    		});
	    	});
	    } else {
	    	res.send({
	    		"error": "token expired"
	    	}) ;next();
	    }
	}, err => {
		res.send({
			"error": "Incorrect token"
		}) ;next();
	})
		} catch (err) {
			res.send({
				"error": "token expired"
			}) ;next();
		}

	} else {
		res.send({
			"error": "incomplete information"
		}) ;next();
	}
}]
