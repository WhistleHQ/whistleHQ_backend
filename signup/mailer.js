'use strict';

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SG_KEY);

const firebase = require("../auth/firebase.js").fire

module.exports = (emails, domain, cb) => {

	const addDoc = firebase.firestore().collection("tokens").add({
		"timestamp": Date.now(),
		"domain": domain
	}).then( ref => {
		if(!ref.id) {
			cb(false);
		}

		const url = process.env.URL + "/register";
		const messages = []
		for (let i = 0; i < emails.length; i++){
			messages.push({
				to: emails[i],
				from: 'hermes@whistlehq.com',
				subject: "You got your token",
				text: "Here is your token test"+ref.id,
				html: "<div><h1>VIAGRA</h1><a clicktracking=off href=" + url + '?token=' + ref.id + "><img src='http://placehold.it/10x10'></a></div>:",
				trackingSettings: {
					enabled: false
				}
			});
	    }
	    sgMail.send(messages)
	    	.then(() => {cb(true)})
	    	.catch((err) => {console.log(err); cb(false)});
	})

}