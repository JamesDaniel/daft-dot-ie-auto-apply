function sms(client, message, config, phoneTo) {
    return client.messages
        .create({
            body: message,
            from: config.phoneFrom,
            to: phoneTo
        });
}

async function sendSms(config, message) {
    const accountSid = config.twilioAccountSid;
    const authToken = config.twilioAuthToken;
    const client = require('twilio')(accountSid, authToken);

    const promises = [];
    promises.push(sms(client, message, config, config.phoneTo1));
    promises.push(sms(client, message, config, config.phoneTo2));
    await Promise.all(promises);
}

module.exports.sendSms = sendSms