const auth = require("../auth")
const firebase = require("../auth/firebase.js").fire
const url = require("url")
const tokenGen = require('casual');
const localdb = require("../db")

const commentdb = firebase.firestore().collection('commentdb');
const dbb = firebase.app().database();
const xss = require("xss");
// const commentdb = firebase.firestore().collection('commentdb');



module.exports = [auth.check, (req, res, next) => {
	res.setHeader('Content-Type', 'application/json');

	if(req.body.token === false) {
		res.send({
			"error" : "Invalid auth"
		})

		return;
	}

	//all the validations
	if(
		//url must be a string
		typeof req.body.url === "string" &&

		//must be able to parse, cannot take a random string
		url.parse(req.body.url).host &&

		//url shouldn't be very long
		req.body.url.length < 2000 &&

		//comment must be a string
		typeof req.body.comment === "string" &&

		//is this enough?
		req.body.comment.length < 10000

	)	{

		//This eliminates any parameters attached
		const urlObj = url.parse(req.body.url);
		const urlpath = (urlObj.host + urlObj.pathname).replace(/[^\w\s]/gi, '');
		localdb.getInfoFromToken(req.body.token, (userInfo) => {
			if(!userInfo) {
				return;
			}
			const comment = {
				"comment" : xss(req.body.comment),
				"username" : userInfo.username || 'null',
				"domain" : userInfo.domain || 'null',
				"time": Date.now()
			}
	
			dbb.ref('domain/' + urlpath).push().set(comment);
	
			res.send({
				"save": "success"
			})

			next();
		})


	} else {
		res.send({
			"error": "comment seems to be invalid."
		})
		next();
	}

}]