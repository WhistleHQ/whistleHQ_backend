const firebase = require("../auth/firebase.js").fire
const url = require("url")

const dbb = firebase.app().database();
// const commentdb = firebase.firestore().collection('commentdb');



module.exports = [(req, res, next) => {
	res.setHeader('Content-Type', 'application/json');

	if(req.body.url && typeof req.body.url === "string") {
		const urlObj = url.parse(req.body.url);
		const urlpath = (urlObj.host + urlObj.pathname).replace(/[^\w\s]/gi, '');
		const info = []

		const comments = dbb.ref('domain/' + urlpath).orderByChild('timestamp').once('value', (ref) => {
			ref.forEach((snap) => {
				info.push(snap.val());
			})

			res.send({
				"info" : info
			})

			next();

		})

	}	else {
		res.send({
			"error": "incorrect url"
		})
	}


}]