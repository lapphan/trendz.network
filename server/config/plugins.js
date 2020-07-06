module.exports = ({env}) => ({
    email: {
        provider: "nodemailer",
        providerOptions: {
            host: 'mail.smtp2go.com',
            port: 2525,
            username: 'vietnamgamingsetup',
            password: 'Rubbed-Sudden-Sepia0-Reheat-Striving',
            secure: false,
            authMethod: "SMTP"
        },
    }
})