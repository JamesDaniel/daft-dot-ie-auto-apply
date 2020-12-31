const fs = require('fs');
const delay = require('../async-utils').delay;
const saveIfNotExists = require('../tasks/data-service').saveIfNotExists;
const puppeteer = require('puppeteer');
const sendMsg = require('../tasks/unix-socket-service').sendMsg;

async function startScraping(config) {
    while (true) {
        try {
            await delay(30000);
            await visitPage(config);
        } catch (error) {
            console.log('Trying again: ' + error);
        }
    }
}

async function visitPage(config) {
    return puppeteer.launch({
        headless: true,
        // args: [
        //     '--start-maximized' // you can also use '--start-fullscreen'
        // ]
    }).then(async (browser) => {
        try {
            const page = await browser.newPage();
            await page.setViewport({
                width: 1800,
                height: 900,
                deviceScaleFactor: 1,
            });
            await page.goto('https://www.rent.ie/houses-to-let/renting_limerick/limerick-city-centre/2_beds/rent_0-1000/');
            await page.click('button[data-tracking=cc-accept]');
            await page.waitForTimeout(1000);

            const searchResults = await getSearchResults(page);

            let apartments = [];

            for (let i = 0; i < searchResults.length; i++) {
                let link = await getLink(searchResults[i]);
                const apartment = {
                    linkText: await getLinkText(page, link),
                    linkUrl: await getLinkUrl(page, link),
                    isDoubleRoom: await isDouble(page, searchResults[i])
                }
                apartments.push(apartment);
            }

            apartments = apartments.filter(e => e.isDoubleRoom);

            const dataSaved = saveIfNotExists(config, apartments);
            if (dataSaved.length > 0) {
                sendMsg('emailListener', 'screenScraper', JSON.stringify(dataSaved))
                    .then(() => {
                        console.log('Data sent to emailer');
                    });
                sendMsg('smsListener', 'screenScraper', JSON.stringify(dataSaved))
                    .then(() => {
                        console.log('Data sent to sms sender');
                    });
            }


            await page.waitForTimeout(2000);
        } catch (error) {
            console.error("Error navigating page." + error);
            throw new Error("Error navigating page");
        } finally {
            await browser.close();
        }
    });
}

async function getLink(searchResult) {
    let l = await searchResult.$$('a');
    return l[0];
}

async function getLinkText(page, link) {
    let value = await page.evaluate(el => el.textContent, link)
    return value.replace(/^\s+|\s+$/g, '');
}

async function getLinkUrl(page, link) {
    let value = await page.evaluate(el => el.getAttribute('href'), link)
    return value.replace(/^\s+|\s+$/g, '');
}

async function getSearchResults(page) {
    await page.waitForSelector('.search_result')
    return await page.$$('.search_result')
}

async function isDouble(page, searchResult) {
    let value = await page.evaluate(el => el.textContent, searchResult)
    return value.includes('2 double');
}

function execute(config, callback) {
    try {
        startScraping(config).then(() => {
            callback(null, 'add-to-file.js');
        })
    } catch (err) {
        callback('add-to-file.js');
    }
}

module.exports.execute = execute;