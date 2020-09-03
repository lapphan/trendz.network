module.exports = ({env}) => ({
	email: {
		provider: 'nodemailer',
		providerOptions: {
			nodemailer_default_from: 'Trendz Network',
			nodemailer_default_replyto: 'noreply@trendz.network',
			host: 'mail.smtp2go.com',
			port: 2525,
			username: 'vietnamgamingsetup',
			password: 'Rubbed-Sudden-Sepia0-Reheat-Striving',
			secure: false,
			authMethod: 'SMTP'
		}
	}
})
