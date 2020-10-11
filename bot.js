const fs = require('fs');
const Discord = require('discord.js');

const globalSettings = require('./globalSettings.dev.json');
const serverSettings = require('./serverSettings.json');
const isUserAdmin = require('./src/isUserAdmin');
const getPrompt = require('./src/getPrompt');
const logMessage = require('./src/logMessage');

let customCommands = require('./customCommands/customcommands.json');
let customResponses = require('./customCommands/customresponses.json');

// Merge all languages
let lang = {};
let commands = {};
lang.english = require('./languages/english.json');
commands.english = require('./languages/commands/english.json');
lang.french = require('./languages/french.json');
commands.french = require('./languages/commands/french.json');

const client = new Discord.Client();

const nanoWords = [1667, 3333, 5000, 6667, 8333, 10000, 11667, 13333, 15000, 16667, 18333, 20000, 21667, 23333, 25000, 26667, 28333, 30000, 31667, 33333, 35000, 36667, 38333, 40000, 41667, 43333, 45000, 46667, 48333, 50000];

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

client.on('ready', () => {
    console.log(lang.english.consoleLanguage);
});

client.on('message', message => {

    if (!message.author.bot) {

        function createNewCustomCommand(command, response, guildCustomCommands, guildCustomResponses) {
            guildCustomCommands.push(command);
            guildCustomResponses.push(response);
            customCommands[guildprop.id] = guildCustomCommands;
            customResponses[guildprop.id] = guildCustomResponses;
            fs.writeFile('./customCommands/customcommands.json', JSON.stringify(customCommands), (err) => {
                if (err) {
                    console.log("An error occured while saving the custom commands for server: " + guildprop.id);
                    console.log(err);
                }
            });
            fs.writeFile('./customCommands/customresponses.json', JSON.stringify(customResponses), (err) => {
                if (err) {
                    console.log("An error occured while saving the custom response for server: " + guildprop.id);
                    console.log(err);
                }
            });
            return "new";
        }
        
        function addCustomCommand(command, response) {
            if (command == response) {
                return "same";
            }
            if (!customCommands[guildprop.id]) {
                customCommands[guildprop.id] = [];
                let guildCustomCommands = [];
                let guildCustomResponses = [];
                return createNewCustomCommand(command, response, guildCustomCommands, guildCustomResponses);
            } else {
                let guildCustomCommands = customCommands[guildprop.id];
                let guildCustomResponses = customResponses[guildprop.id];
        
                if (guildCustomCommands.some(function (e) { return e == command })) {
                    guildCustomResponses[guildCustomCommands.indexOf(command)] = response;
                    fs.writeFile('./customCommands/customresponses.json', JSON.stringify(customResponses), (err) => {
                        if (err) {
                            console.log("An error occured while saving the custom response for server: " + guildprop.id);
                            console.log(err);
                        }
                    });
                    return "changed";
                } else {
                    return createNewCustomCommand(command, response, guildCustomCommands, guildCustomResponses);
                }
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

        if (!customCommands[guildprop.id]) {
            customCommands[guildprop.id] = [];
        }

        if (!customResponses[guildprop.id]) {
            customResponses[guildprop.id] = [];
        }

        // Check custom commands
        if (customCommands[guildprop.id].some(function (e) { return e == message.content })) {
            const customCommandNumber = customCommands[guildprop.id].indexOf(message.content);
            message.channel.send(customResponses[guildprop.id][customCommandNumber]);
        }

        // Register new commands
        if (message.content.startsWith("!!custom") && isUserAdmin(message.member)) {
            const messageArgs = message.content.split("--");
            if (!messageArgs[2] || messageArgs[1].trim() == "" || messageArgs[2].trim() == "") {
                message.channel.send(lang[messageLanguage].customSpecifyCommand)
            } else {
                const addCommand = addCustomCommand(messageArgs[1].trim(), messageArgs[2].trim());
                if (addCommand == "new") {
                    message.channel.send(lang[messageLanguage].customCommandAdded);
                } else if (addCommand == "changed") {
                    message.channel.send(lang[messageLanguage].customCommandChanged);
                } else if (addCommand == "same") {
                    message.channel.send(lang[messageLanguage].customCommandsNeedToBeDifferent);
                } else {
                    message.channel.send(lang[messageLanguage].somethingWentWrong);
                }
            }
        }

        // Delete custom command
        if (message.content.startsWith("!delete")) {
            const commandToDelete = message.content.substring(8);
            if (customCommands[guildprop.id].indexOf(commandToDelete) > -1) {
                const commandIndex = customCommands[guildprop.id].indexOf(commandToDelete)
                customCommands[guildprop.id].splice(commandIndex, 1);
                customResponses[guildprop.id].splice(commandIndex, 1);
                message.channel.send("The custom command was deleted.");
                fs.writeFile('./customCommands/customcommands.json', JSON.stringify(customCommands), (err) => {
                    if (err) {
                        console.log("An error occured while saving the custom commands for server: " + guildprop.id);
                        console.log(err);
                    }
                });
                fs.writeFile('./customCommands/customresponses.json', JSON.stringify(customResponses), (err) => {
                    if (err) {
                        console.log("An error occured while saving the custom responses for server: " + guildprop.id);
                        console.log(err);
                    }
                });
            } else {
                message.channel.send("The command you want to remove from the channel does not exist.");
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

        if (message.content.startsWith("!language") && isUserAdmin(message.member)) {
            let id = guildprop.id;
            let enteredCommand = message.content.split(" ");
            let newServerLanguage = enteredCommand[1].toLowerCase();

            if (serverSettings[id]) {
                if (lang[newServerLanguage]) {
                    serverSettings[id].language = newServerLanguage;
                    fs.writeFile('serverSettings.json', JSON.stringify(serverSettings), (err) => {
                        if (err) {
                            logMessage("An error occured while trying to save the server settings.", "", guildprop.name)
                            console.log(err);
                        }
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
                    if (err) {
                        console.log("An error occured while trying to save the server settings.");
                        console.log(err);
                    }
                });

                message.channel.send("The language for this server was changed to " + newServerLanguage + ".");
            }
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