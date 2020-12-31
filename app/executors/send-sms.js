const smsService = require('../tasks/sms-service');
const listen = require('../tasks/unix-socket-service').listen;

async function startListening(config) {
    try {
        listen(`${config.appId}smsListener`, (data) => {
            sendSms(config, JSON.parse(data));
        });
    } catch (error) {
        console.log('Trying again: ' + error);
    }
}

function sendSms(config, data) {
    if (data.length < 1) {
        return;
    }
    smsService.sendSms(config, "New Apartments Found. Check your email");
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