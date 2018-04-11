const localdb = require('../db');
const sendTokens = require('../signup/mailer.js');
const freeDomains = require('../free_email_domains.json');

function emailExtractor(text) {
	return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

module.exports = [(req, res, next) => {
	res.setHeader('Content-Type', 'application/json');

	const emailString = req.body.emails;

	if(typeof emailString === "string") {
		const emails = emailExtractor(emailString);
		if(emails.length < 1) {
			res.send({
				"error" : "Must include multiple emails"
			});
		}	else {
			//check domains of all emails, they must be some.
			var setDomain = false;
			for(let i=0,j=emails.length; i<j; i++) {

				// check the parts after the @
				let foundDomain = emails[i].split('@')[1]
                let blacklisted = checkFreeDomain(foundDomain)

				if(!setDomain) {
					//This should happen the first time
                    if(blacklisted) {
                        response.send('The email domain you entered, <b>'+foundDomain+'</b> has been blocked. Try again with different domain.')
                        return;
                    }
					setDomain = foundDomain
				} else if (setDomain != foundDomain) {
					//Send error and exit
					res.send({
						"error" : "All emails must be from the same domain"
					});

					next();

					return;
				}
			}

			//Check if the domain is one of those free email providers
			if(freeDomains[setDomain]) {
				res.send({
					"error": "Seems like a free domain, use your official email id."
				}); next();
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