const auth = require("../auth")
const localdb = require('../db');

module.exports = [auth.check, (req, res, next) => {
	res.setHeader('Content-Type', 'application/json');
	if(req.body.token) {
		const data = localdb.getInfoFromToken(req.body.token);
		res.send({
			"token" : req.body.token,
			"name" : data.name,
			"domain": data.domain || "No domain found (It was created during testing)"
		});
	}	else {
		res.send({
			"error" : "not found"
		});
	}
	next();
}]