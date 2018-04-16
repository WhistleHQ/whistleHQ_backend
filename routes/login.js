const auth = require("../auth")
const localdb = require('../db');

module.exports = [auth.check, (req, res, next) => {
	res.setHeader('Content-Type', 'application/json');
	if(req.body.token) {
		localdb.getInfoFromToken(req.body.token, (data) => {
			if(!data) {
				return;
			}
			res.send({
				"token" : req.body.token,
				"name" : data.name,
				"domain": data.domain || "No domain found (It was created during testing)"
			});
			res.cookie("token", req.body.token)
			next();
		})

	}	else {
		res.send({
			"error" : "not found"
		});
		next();
	}
}]