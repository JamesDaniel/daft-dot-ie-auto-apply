const application = require('./app/main');
const config = {
    filename: process.env.FILENAME || './apartments.json'
};

try {
    application.main(config);
} catch (err) {
    console.error("An error occurred in the program main execution.", err);
    process.exit(1);
}
