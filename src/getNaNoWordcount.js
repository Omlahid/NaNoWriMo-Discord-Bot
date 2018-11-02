module.exports = function getNaNoWordcount(user, https = require('https'), globalSettings = require('../globalSettings.json'), parseString = require('xml2js').parseString) {
    return new Promise(function (resolve, reject) {
        const urlToCall = "https://nanowrimo.org/wordcount_api/wc/" + user;
        let req = https.request(urlToCall, res => {
            if (globalSettings.debug) {
                console.log('statusCode:', res.statusCode);
            }
            res.on('data', (d) => {
                parseString(d, function (err, result) {
                    if (result.wc.user_wordcount != null) {
                        resolve(result.wc.user_wordcount);
                    } else if (result.wc.error == "user does not exist") {
                        resolve("userNoExist");
                    } else if (result.wc.error == "user does not have a current novel") {
                        resolve("userNoNovel");
                    }
                    if (err) {
                        console.log("Error when getting the word count: " + err);
                    }
                })
            });
        });
        req.on('error', (e) => {
            console.error("Error while fetching the user wordcount :" + e);
            reject("somethingWentWrong");
        });
        req.end();
    });
}