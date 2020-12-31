const application = require('./app/main');
const config = {
    appId: 'daftDotIeScreenScraper',
    filename: process.env.FILENAME || './apartments.json',
    emailFrom: process.env.EMAIL_FROM,
    emailSenderPassword: process.env.EMAIL_SENDER_PASSWORD,
    emailTo1: process.env.EMAIL_TO_1,
    emailTo2: process.env.EMAIL_TO_2,
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    phoneFrom: process.env.PHONE_FROM,
    phoneTo1: process.env.PHONE_TO_1,
    phoneTo2: process.env.PHONE_TO_2
};

try {
    application.main(config);
} catch (err) {
    console.error("An error occurred in the program main execution.", err);
    process.exit(1);
}
