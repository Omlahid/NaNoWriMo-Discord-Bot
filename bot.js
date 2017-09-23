const fs = require('fs')
const https = require('https');
const parseString = require('xml2js').parseString;
const Discord = require('discord.js');
const auth = require('./auth.json');
const prompts = require('./prompts.json');
const userDb = require('./users/users.json');
const client = new Discord.Client();

const nanoWords = [1667, 3333, 5000, 6667, 8333, 10000, 11667, 13333, 15000, 16667, 18333, 20000, 21667, 23333, 25000, 26667, 28333, 30000, 31667, 33333, 35000, 36667, 38333, 40000, 41667, 43333, 45000, 46667, 48333, 50000];

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

if (auth.language.endsWith(".json")) {
    language = language.substring(0, str.length - 5);
}

try {
    var lang = require('./languages/' + auth.language.toLowerCase() + '.json');
}
catch (e) {
    try {
        var lang = require('./languages/english.json')
        console.error('ERROR: The language could not be detected. Ensure your json file name has the same name as your language declared in auth.json.\nLoading English language by default.')
    }
    catch (e) {
        console.error('ERROR: You have deleted the english.json file. Download it from https://github.com/Omlahid/NaNoWriMo-Discord-Bot, and ensure it is in the same folder as bot.js.')
    }
}

try {
    var commands = require('./languages/commands/' + auth.language.toLowerCase() + '.json');
}
catch (e) {
    try {
        var commands = require('./languages/commands/english.json')
        console.error('ERROR: The command language could not be detected. Ensure your json file name has the same name as your language declared in auth.json.\nLoading English language by default.')
    }
    catch (e) {
        console.error('ERROR: You have deleted the command english.json file. Download it from https://github.com/Omlahid/NaNoWriMo-Discord-Bot, and ensure it is in the same folder as bot.js.')
    }
}

client.on('ready', () => {
    console.log(lang.consoleLanguage);
});

// The two following variables are used only for the 'Who da best?' function

var currentMessageAuthorTime = 0;

var currentMessageAuthor = 0;

var isSprintStarted = false;

// function to log a message in the console
function logMessage(msg, author) {
    var currentTime = new Date();
    var currentHour = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    var currentSeconds = currentTime.getSeconds();
    var currentDay = currentTime.getDate();
    var currentMonth = currentTime.getMonth() + 1;
    var currentYear = currentTime.getFullYear();
    if (currentDay < 10) {
        currentDay = "0" + currentDay;
    }
    if (currentMonth < 10) {
        currentMonth = "0" + currentMonth;
    }
    if (currentMinutes < 10) {
        currentMinutes = "0" + currentMinutes;
    }
    if (currentSeconds < 10) {
        currentSeconds = "0" + currentSeconds;
    }
    var timeNow = currentYear + "/" + currentMonth + "/" + currentDay + " : " + currentHour + ":" + currentMinutes + ":" + currentSeconds;
    console.log("[" + timeNow + "] " + author + " " + msg);
}

function addUserToDb(id, user, house) {
    let newUser = {
        "NaNoUser": user,
        "house": house
    }
    userDb[id] = newUser;
    var pushDb = JSON.stringify(userDb);
    try {
        fs.writeFile('users/users.json', pushDb)
    }
    catch (e) {
        console.log("An error occurred while trying to save the user in the JSON:");
        console.log(e);
    }
}

function getNaNoWordcount(user) {
    return new Promise(function (resolve, reject) {
        urlToCall = "https://nanowrimo.org/wordcount_api/wc/" + user
        let req = https.request(urlToCall, res => {
            if (auth.debug == 1) {
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

// register users
client.on('message', message => {

    function sprintEnded() {
        message.channel.send(lang.sprintEnd);
        isSprintStarted = !isSprintStarted;
        logMessage("Sprint finished", "");
    }

    function sendRemainingSprintTime(x, min) {
        var minutesRemainingInTotal = min - ((x - 1) * 5) // A bit of math to calculate the right amount of time left
        setTimeout(function () {
            message.channel.send(lang.remainingSprintTime + minutesRemainingInTotal + lang.remainingSprintTime2);
        }, x * 5000 * auth.debug); // 5000 for seconds (testing purposes), 300000 for minutes
    }

    function startSprintDelay(length) {
        logMessage("asked for a " + length + " minute sprint", message.author.username);
        message.channel.send(lang.startSprintDelay + sprintTimeDemanded + lang.startSprintDelay2);
        isSprintStarted = !isSprintStarted;
        setTimeout(function () {
            startSprint(length)
        }, 15000);
    }

    function startSprint(length) {
        message.channel.send(lang.startSprint + sprintTimeDemanded + lang.startSprint2);
        setTimeout(sprintEnded, length * 1000 * auth.debug) // 60000 is for minutes, 1000 is for seconds (testing purposes)
        var minutesLeftToSprint = sprintTimeDemanded - 5;
        for (var x = 1, ln = length / 5; x < ln; x++ , minutesLeftToSprint - 5) {
            sendRemainingSprintTime(x, minutesLeftToSprint);
        }
    }

    // Register users
    if (message.content.toLowerCase().replaceAll(" ", "").startsWith(commands.mynameis)) {
        let id = message.author.id;
        let usermsg = message.content.replaceAll(" ", "");
        let properUser = usermsg.substring(commands.mynameis.length);
        let user = properUser.toLowerCase().replaceAll(" ", "-");
        let house = "none";
        console.log("That person's name is " + user);
        try {
            addUserToDb(id, user, house);
            console.log("user added successfully");
            message.channel.send(lang.userAdded + properUser + " :)");
        }
        catch (e) {
            console.log("Could not add user.");
            message.channel.send(lang.somethingWentWrong);
        }
    }

    // Give users their own current words
    if (message.content.toLowerCase().replaceAll(" ", "") == commands.mywords) {
        id = message.author.id;
        try {
            username = userDb[id].NaNoUser;
            getNaNoWordcount(username).then(e => {
                if (e == "0") {
                    message.channel.send(lang.noWordsYet);
                    logMessage("looked up their own words", message.author.username);
                } else if (e == "userNoExist") {
                    message.channel.send(lang.userNotFound);
                    logMessage("tried to look up their own words, but their username is wrong", message.author.username);
                } else if (e == "userNoNovel") {
                    message.channel.send(lang.userNotStarted);
                    logMessage("tried to look up their own words, but they haven't started yet", message.author.username);
                } else {
                    message.channel.send(lang.userWordcount + e);
                    logMessage("looked up their own words", message.author.username);
                }
            }).catch(function () {
                console.log("Promise Rejected");
                message.channel.send(lang.somethingWentWrong);
            })
        }
        catch (e) {
            message.channel.send(lang.usernameInvalid);
        }
    }

    // Give users someone else's wordcount
    if (message.content.toLowerCase().startsWith(commands.words)) {
        let properUser = message.content.substring(commands.words.length + 1);
        let username = properUser.toLowerCase().replaceAll(" ", "-");
        getNaNoWordcount(username).then(e => {
            if (e == "0") {
                message.channel.send(properUser + lang.noWordsYetOtherUser);
                logMessage("looked up their own words", message.author.username);
            } else if (e == "userNoExist") {
                message.channel.send(lang.userNotFound);
                logMessage("tried to look up " + properUser + ", but their username is wrong", message.author.username);
            } else if (e == "userNoNovel") {
                message.channel.send(properUser + lang.otherUserNotStarted);
                logMessage("tried to look up " + properUser + ", but they haven't started yet", message.author.username);
            } else {
                message.channel.send(properUser + lang.otherUserWordcount + e);
                logMessage("looked up the words of " + properUser, message.author.username);
            }
        }).catch(function () {
            console.log("Promise Rejected");
            message.channel.send(lang.somethingWentWrong);
        })
    }

    // Sprints
    if (message.content.startsWith(commands.sprint)) {
        if (isSprintStarted) {
            message.channel.send(lang.sprintAlreadyStarted);
        } else {
            var sprintTimeDemanded = message.content.substring(commands.sprint.length + 1);
            if (sprintTimeDemanded % 5 == 0) {
                if (sprintTimeDemanded > 60) {
                    message.channel.send(lang.sprintTooLong);
                } else {
                    startSprintDelay(sprintTimeDemanded);
                }
            } else {
                message.channel.send(lang.sprintIntervalLength)
            }
        }
    }

    // Get wordcount during NaNoWriMo
    if (message.content == commands.wordcount) {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        if (mm < 11) {
            message.channel.send(lang.NanoNotStartedYet);
        } else if (mm > 11) {
            message.channel.send(lang.NanoOver);
        } else {
            let todayWords = nanoWords[dd - 1]
            message.channel.send(lang.todayWordcount + todayWords + ".");
        }
    }

    // Who da best?
    if (message.content.toLowerCase() == 'who da best?') {
        let whoDaBestRand = Math.floor(Math.random() * 100)

        if (whoDaBestRand == 1) {
            message.channel.send("Omlahid is da best!");
        } else if (whoDaBestRand == 2) {
            message.channel.send("I am. I am the best.");
        } else {
            var newMessageAuthor = 0;
            newMessageAuthor = message.author.id;
            if (currentMessageAuthor != newMessageAuthor) {
                currentMessageAuthor = newMessageAuthor;
                currentMessageAuthorTime *= 0;
            } else {
                currentMessageAuthorTime++;
            }
            if (currentMessageAuthorTime > 1) {
                message.reply(lang.stopWhoDaBest);
            } else {
                message.reply(lang.whoDaBest)
            }
        }
    }

    // Cheer! :cheer:
    if (message.content == commands.cheer) {
        message.channel.send(lang.cheeringMessage);
    }

    // Prompts
    if (message.content == commands.prompt) {
        var themes = prompts.writingPrompts;
        var randomNumberRaw = Math.floor(Math.random() * (themes.length) - 1);
        var thisPrompt = themes[randomNumberRaw];
        message.channel.send(lang.showPrompt + thisPrompt);
        logMessage("received prompt number " + randomNumberRaw, message.author.username)
    }

    // !help
    if (message.content == commands.help || message.content == "!help") {
        message.channel.send(lang.helpMessage);
    }

    // Pokemon
    if (message.content.includes("pokemon")) {
        logMessage(" mentionned pokemon", message.author.username);
    }

    // Glow Cloud
    if (message.content.includes("glow cloud")) {
        message.channel.send("All Hail the Glow Cloud");
        logMessage("All Hail the Glow Cloud", "");
    }
});

// Client token, required for the bot to work
try {
    client.login(auth.token);
}
catch (e) {
    console.log("ERROR: No account was linked to your bot. Please provide a valid authentication token. You can change it in the auth.json file.")
}