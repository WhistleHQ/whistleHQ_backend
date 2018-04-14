const localdb = require('../db');
const sendTokens = require('../signup/mailer.js');
const freeDomains = require('../free_email_domains.json');

function emailExtractor(text) {
	//This regex converts a string of email address to an array of email ids
	return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

module.exports = [(req, res, next) => {
	res.setHeader('Content-Type', 'application/json');

	const emailString = req.body.emails;

	if(typeof emailString === "string") {
		let emails = emailExtractor(emailString);
		
		//Eliminate duplicates
		//from https://stackoverflow.com/a/45427662/3001704
		emails = [...new Set(emails)];

		if(emails.length <= 1) {
			res.send({
				"error" : "Must include multiple unique emails"
			});
		}	else {
			//check domains of all emails, they must be some.
			var setDomain = false;
			for(let i=0,j=emails.length; i<j; i++) {

				// check the parts after the @
				let foundDomain = emails[i].split('@')[1]

				if(!setDomain) {
					//This should happen the first time
					setDomain = foundDomain
				} else if (setDomain != foundDomain) {
					//Send error and exit
					res.send({
						"error" : "All emails must be from the same domain"
					});
					next();
					return;
				} else if (freeDomains[setDomain]) {
					//When a free domain is used.
					res.send({
						"error" : "Please use your official email address. Free domains are not allowed"
					});
					next();
					return;
				}
			}

			sendTokens(emails, setDomain, (status) => {
				if(status) {
					res.send({
						"success": "Token sent, check your email"
					})
				}	else {
					res.send({
						"error": "Unable to send emails."
					})
				}
				next();
			})

		}

	}

}]