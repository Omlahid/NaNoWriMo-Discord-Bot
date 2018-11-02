const fs = require('fs');
const Discord = require('discord.js');

const globalSettings = require('./globalSettings.json');
const userDb = require('./users/users.json');
const serverSettings = require('./serverSettings.json');
const isUserAdmin = require('./src/isUserAdmin');
const getPrompt = require('./src/getPrompt');
const logMessage = require('./src/logMessage');
const getNaNoWordcount = require('./src/getNaNoWordcount');

// Merge all languages
let lang = {};
let commands = {};
lang.english = require('./languages/english.json');
commands.english = require('./languages/commands/english.json');
lang.french = require('./languages/french.json');
commands.french = require('./languages/commands/french.json');

let minuteLength = 60;
if (globalSettings.debug) {
    minuteLength = 1;
}

const client = new Discord.Client();

const nanoWords = [1667, 3333, 5000, 6667, 8333, 10000, 11667, 13333, 15000, 16667, 18333, 20000, 21667, 23333, 25000, 26667, 28333, 30000, 31667, 33333, 35000, 36667, 38333, 40000, 41667, 43333, 45000, 46667, 48333, 50000];

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

client.on('ready', () => {
    console.log(lang.english.consoleLanguage);
});

var sprint = {};

function addUserToDb(id, user, house) {
    let newUser = {
        "NaNoUser": user,
        "house": house
    }
    userDb[id] = newUser;
    let pushDb = JSON.stringify(userDb);
    fs.writeFile('users/users.json', pushDb, (err) => {
        if (err) {
            console.log("An error occurred while trying to save the user in the JSON:");
            console.log(err);
        }
    })
}

client.on('message', message => {

    function sprintEnded() {
        message.channel.send(lang[messageLanguage].sprintEnd);
        sprint[guildprop.id].isSprintStarted = !sprint[guildprop.id].isSprintStarted;
        logMessage("Sprint finished", "", guildprop.name);
    }

    function sendRemainingSprintTime(x, min) {
        var minutesRemainingInTotal = min - ((x - 1) * 5) // A bit of math to calculate the right amount of time left
        setTimeout(function () {
            message.channel.send(lang[messageLanguage].remainingSprintTime + minutesRemainingInTotal + lang[messageLanguage].remainingSprintTime2);
        }, x * 5000 * minuteLength); // 5000 for seconds (testing purposes), 300000 for minutes
    }

    function startSprintDelay(length) {
        logMessage("asked for a " + length + " minute sprint", message.author.username, guildprop.name);
        message.channel.send(lang[messageLanguage].startSprintDelay + sprintTimeDemanded + lang[messageLanguage].startSprintDelay2);
        sprint[guildprop.id].isSprintStarted = !sprint[guildprop.id].isSprintStarted;
        setTimeout(function () {
            startSprint(length)
        }, 15000);
    }

    function startSprint(length) {
        message.channel.send(lang[messageLanguage].startSprint + sprintTimeDemanded + lang[messageLanguage].startSprint2);
        setTimeout(sprintEnded, length * 1000 * minuteLength) // 60000 is for minutes, 1000 is for seconds (testing purposes)
        var minutesLeftToSprint = sprintTimeDemanded - 5;
        for (var x = 1, ln = length / 5; x < ln; x++ , minutesLeftToSprint - 5) {
            sendRemainingSprintTime(x, minutesLeftToSprint);
        }
    }

    let guildprop = {};

    if (message.guild) {
        guildprop = {
            "id": message.guild.id,
            "name": message.guild.name
        }
    } else {
        if (message.channel.recipient) {
            // When the message is a DM
            guildprop = {
                "id": message.channel.id,
                "name": message.channel.recipient.username
            }
        } else {
            if (message.channel.name != null) {
                // When the message is a group DM and a name was set for this group
                guildprop = {
                    "id": message.channel.id,
                    "name": message.channel.name
                }
            } else {
                // When the message is a group DM, but no name was set for this group
                let dmNames = message.channel.recipients.nicks.array();
                guildprop = {
                    "id": message.channel.id,
                    "name": dmNames
                }
            }
        }
    }

    let messageLanguage = '';
    if (serverSettings[guildprop.id]) {
        messageLanguage = serverSettings[guildprop.id].language;
    } else {
        messageLanguage = 'english';
    }

    if (!sprint[guildprop.id]) {
        sprint[guildprop.id] = { "isSprintStarted": false };
    }

    // Register users
    if (message.content.toLowerCase().replaceAll(" ", "").startsWith(commands[messageLanguage].mynameis)) {
        let id = message.author.id;
        let usermsg = message.content.replaceAll(" ", "");
        let properUser = usermsg.substring(commands[messageLanguage].mynameis.length);
        let user = properUser.toLowerCase().replaceAll(" ", "-");
        let house = "none";
        console.log("That person's name is " + user);
        try {
            addUserToDb(id, user, house);
            console.log("user added successfully");
            message.channel.send(lang[messageLanguage].userAdded + properUser + " :)");
        }
        catch (e) {
            console.log("Could not add user.");
            message.channel.send(lang[messageLanguage].somethingWentWrong);
        }
    }

    // Give users their own current words
    if (message.content.toLowerCase().replaceAll(" ", "") == commands[messageLanguage].mywords) {
        id = message.author.id;
        try {
            username = userDb[id].NaNoUser;
            getNaNoWordcount(username).then(e => {
                if (e == "0") {
                    message.channel.send(lang[messageLanguage].noWordsYet);
                    logMessage("looked up their own words", message.author.username, guildprop.name);
                } else if (e == "userNoExist") {
                    message.channel.send(lang[messageLanguage].userNotFound);
                    logMessage("tried to look up their own words, but their username is wrong", message.author.username, guildprop.name);
                } else if (e == "userNoNovel") {
                    message.channel.send(lang[messageLanguage].userNotStarted);
                    logMessage("tried to look up their own words, but they haven't started yet", message.author.username, guildprop.name);
                } else {
                    message.channel.send(lang[messageLanguage].userWordcount + e);
                    logMessage("looked up their own words", message.author.username, guildprop.name);
                }
            }).catch(function () {
                console.log("Promise Rejected");
                message.channel.send(lang[messageLanguage].somethingWentWrong);
            })
        }
        catch (e) {
            message.channel.send(lang[messageLanguage].usernameInvalid);
        }
    }

    // Sprints
    if (message.content.startsWith(commands[messageLanguage].sprint)) {
        if (sprint[guildprop.id].isSprintStarted) {
            message.channel.send(lang[messageLanguage].sprintAlreadyStarted);
        } else {
            var sprintTimeDemanded = message.content.substring(commands[messageLanguage].sprint.length + 1);
            if (sprintTimeDemanded % 5 == 0) {
                if (sprintTimeDemanded > 60) {
                    message.channel.send(lang[messageLanguage].sprintTooLong);
                } else {
                    startSprintDelay(sprintTimeDemanded);
                }
            } else {
                message.channel.send(lang[messageLanguage].sprintIntervalLength)
            }
        }
    }

    // Get wordcount during NaNoWriMo
    if (message.content == commands[messageLanguage].wordcount) {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        if (mm < 11) {
            message.channel.send(lang[messageLanguage].NanoNotStartedYet);
        } else if (mm > 11) {
            message.channel.send(lang[messageLanguage].NanoOver);
        } else {
            let todayWords = nanoWords[dd - 1]
            message.channel.send(lang[messageLanguage].todayWordcount + todayWords + ".");
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
            message.reply(lang[messageLanguage].whoDaBest)
        }
    }

    // Cheer! :cheer:
    if (message.content == commands[messageLanguage].cheer) {
        message.channel.send(lang[messageLanguage].cheeringMessage);
    }

    // Prompts
    if (message.content == commands[messageLanguage].prompt) {
        let currentPrompt = getPrompt();
        message.channel.send(lang[messageLanguage].showPrompt + currentPrompt);
        logMessage("received prompt: " + currentPrompt, message.author.username, guildprop.name)
    }

    // !help
    if (message.content == commands[messageLanguage].help || message.content == "!help") {
        message.channel.send(lang[messageLanguage].helpMessage);
    }

    // Pokemon
    if (message.content.includes("pokemon")) {
        logMessage(" mentionned pokemon", message.author.username, guildprop.name);
    }

    // Glow Cloud
    if (message.content.includes("glow cloud")) {
        message.channel.send("All Hail the Glow Cloud");
        logMessage("All Hail the Glow Cloud", "", guildprop.name);
    }

    // Give users someone else's wordcount
    if (message.content.toLowerCase().startsWith(commands[messageLanguage].words)) {
        if (message.content.includes("<@")) {
            const saneMessage = message.content.replaceAll("!", "");
            const id = saneMessage.substring(saneMessage.indexOf("@") + 1, saneMessage.indexOf(">"));
            try {
                const username = userDb[id].NaNoUser;
                getNaNoWordcount(username).then(e => {
                    if (e == "0") {
                        message.channel.send(username + lang[messageLanguage].noWordsYetOtherUser);
                        logMessage("looked up their own words", message.author.username, guildprop.name);
                    } else if (e == "userNoExist") {
                        message.channel.send(lang[messageLanguage].userNotFound);
                        logMessage("tried to look up " + username + ", but their username is wrong", message.author.username, guildprop.name);
                    } else if (e == "userNoNovel") {
                        message.channel.send(username + lang[messageLanguage].otherUserNotStarted);
                        logMessage("tried to look up " + username + ", but they haven't started yet", message.author.username, guildprop.name);
                    } else {
                        message.channel.send(username + lang[messageLanguage].otherUserWordcount + e);
                        logMessage("looked up the words of " + username, message.author.username, guildprop.name);
                    }
                }).catch(function () {
                    console.log("Promise Rejected");
                    message.channel.send(lang[messageLanguage].somethingWentWrong);
                })
            }
            catch (e) {
                message.channel.send(lang[messageLanguage].usernameInvalid);
            }
        } else {
            let properUser = message.content.substring(commands[messageLanguage].words.length + 1);
            let username = properUser.toLowerCase().replaceAll(" ", "-");
            getNaNoWordcount(username).then(e => {
                if (e == "0") {
                    message.channel.send(properUser + lang[messageLanguage].noWordsYetOtherUser);
                    logMessage("looked up their own words", message.author.username, guildprop.name);
                } else if (e == "userNoExist") {
                    message.channel.send(lang[messageLanguage].userNotFound);
                    logMessage("tried to look up " + properUser + ", but their username is wrong", message.author.username, guildprop.name);
                } else if (e == "userNoNovel") {
                    message.channel.send(properUser + lang[messageLanguage].otherUserNotStarted);
                    logMessage("tried to look up " + properUser + ", but they haven't started yet", message.author.username, guildprop.name);
                } else {
                    message.channel.send(properUser + lang[messageLanguage].otherUserWordcount + e);
                    logMessage("looked up the words of " + properUser, message.author.username, guildprop.name);
                }
            }).catch(function () {
                console.log("Promise Rejected");
                message.channel.send(lang[messageLanguage].somethingWentWrong);
            })
        }
    }

    if (message.content.startsWith("!language") && isUserAdmin(message.member)) {
        let id = guildprop.id;
        let enteredCommand = message.content.split(" ");
        let newServerLanguage = enteredCommand[1].toLowerCase();

        if (serverSettings[id]) {
            if (lang[newServerLanguage]) {
                serverSettings[id].language = newServerLanguage;
                fs.writeFile('serverSettings.json', JSON.stringify(serverSettings), (err) => {
                    logMessage("An error occured while trying to save the server settings.", "", guildprop.name)
                    console.log(err);
                });
                message.channel.send("The language for this server was changed to " + newServerLanguage);
            } else {
                message.channel.send('This language is invalid. The available languages are: English and French.');
            }
        } else {
            let newServerSettings = {
                "language": newServerLanguage,
                "approvedAdmins": []
            }
            serverSettings[id] = newServerSettings;
            let pushSettings = JSON.stringify(serverSettings);
            fs.writeFile('serverSettings.json', pushSettings, (err) => {
                console.log("An error occured while trying to save the server settings.");
                console.log(err);
            });

            message.channel.send("The language for this server was changed to " + newServerLanguage + ".");
        }
    }
});

client.on("error", () => {
    console.log("An unexpected error occurred on Discord's end. The bot will continue to run as expected.");
});

// Client token, required for the bot to work
try {
    client.login(globalSettings.token);
}
catch (e) {
    console.log("ERROR: No account was linked to your bot. Please provide a valid authentication token. You can change it in the globalSettings.json file.")
}