const fs = require('fs');

function appendIfNotExists(config, newData) {
    const fileData = JSON.parse(fs.readFileSync(config.filename, 'utf8'));

    const uniqueKeys = fileData.map(el => el.linkUrl);

    const dataToSave = newData.filter(el => {
        return !uniqueKeys.includes(el.linkUrl);
    });

    dataToSave.forEach(el => {
        el.emailSent = false;
        el.smsSent = false;
        el.applicationSent = false;
    })

    dataToSave.forEach(el => fileData.push(el));

    console.log(`${dataToSave.length} new apartment(s) found`);

    if (dataToSave.length > 0) {
        fs.writeFileSync(config.filename, JSON.stringify(fileData, null, 2));
    }
}

module.exports.appendIfNotExists = appendIfNotExists;