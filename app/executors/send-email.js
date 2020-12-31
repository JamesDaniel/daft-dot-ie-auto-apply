const emailService = require('../tasks/email-service');
const listen = require('../tasks/unix-socket-service').listen;

async function startListening(config) {
    try {
        listen(`${config.appId}emailListener`, (data) => {
            sendEmail(config, JSON.parse(data));
        });
    } catch (error) {
        console.log('Trying again: ' + error);
    }
}

function sendEmail(config, data) {
    if (data.length < 1) {
        return;
    }
    const message = data.reduce((preVal, curVal) => {
        return (preVal + curVal.linkUrl + "\n");
    }, "\nApartments Found List: \n");
    emailService.sendEmail(config, message);
}

function execute(config, callback) {
    try {
        startListening(config).then(() => {
            callback(null, 'add-to-file.js');
        })
    } catch (err) {
        callback('add-to-file.js');
    }
}

module.exports.execute = execute;