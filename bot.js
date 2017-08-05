var auth = require('./auth.json');

var Discord = require('discord.js');

var prompts = require('./prompts.json');

var client = new Discord.Client();

var isSprintStarted = false;

var language = auth.language;

if (language.endsWith(".json")) {
    language = language.substring(0, str.length - 5);
}

try {
    var lang = require('./languages/' + language.toLowerCase() +'.json');
}
catch(e) {
    try {
        var lang = require('./languages/english.json')
        console.log('ERROR: The language could not be detected. Ensure your json file name has the same name as your language declared in auth.json.\nLoading English language by default.')
    }
    catch(e) {
        console.log('ERROR: You have deleted the english.json file. Download it from https://github.com/Omlahid/NaNoWriMo-Discord-Bot, and ensure it is in the same folder as bot.js.')
    }
}

var token = auth.token;

// The two following variables are used only for the 'Who da best?' function

var currentMessageAuthorTime = 0;

var currentMessageAuthor = 0;

console.log(lang.consoleLanguage);

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

// How sprints are handled. Syntax = '!sprint' + number divisible by 5. Max is 60.
client.on('message', message => {

    function sprintEnded() {
        // Functions that send messages to the channel have to be declared in the message. Otherwise 'message' is not defined
        message.channel.sendMessage(lang.sprintEnd);
        isSprintStarted = !isSprintStarted;
        logMessage("Sprint finished", "");
    }

    function sendRemainingSprintTime(x, min) {
        // Functions that send messages to the channel have to be declared in the message. Otherwise 'message' is not defined
        var minutesRemainingInTotal = min - ((x - 1) * 5) // A bit of math to calculate the right amount of time left
        setTimeout(function () {
            message.channel.sendMessage(lang.remainingSprintTime + minutesRemainingInTotal + lang.remainingSprintTime2);
        }, x * 300000); // 5000 for seconds (testing purposes), 300000 for minutes
    }

    if (message.content.startsWith("!sprint")) {
        if (isSprintStarted) {
            message.channel.sendMessage(lang.sprintAlreadyStarted);
        } else {
            var sprintTimeDemanded = message.content.substring(8);
            if (sprintTimeDemanded % 5 == 0) {
                if (sprintTimeDemanded > 60) {
                    message.channel.sendMessage(lang.sprintTooLong);
                } else {
                    message.channel.sendMessage(lang.startSprint + sprintTimeDemanded + lang.startSprint2);
                    isSprintStarted = !isSprintStarted;
                    logMessage("asked for a " + sprintTimeDemanded + " minute sprint", message.author.username);
                    setTimeout(sprintEnded, sprintTimeDemanded * 60000) // 60000 is for minutes, 1000 is for seconds (testing purposes)
                    var minutesLeftToSprint = sprintTimeDemanded - 5;
                    for (var x = 1, ln = sprintTimeDemanded / 5; x < ln; x++ , minutesLeftToSprint - 5) {
                        sendRemainingSprintTime(x, minutesLeftToSprint);
                    }
                }
            } else {
                message.channel.sendMessage(lang.sprintIntervalLength)
            }
        }
    }
});

// Get wordcount during NaNoWriMo
client.on('message', message =>{
	var nanoWords = [1667, 3333, 5000, 6667, 8333, 10000, 11667, 13333, 15000, 16667, 18333, 20000, 21667, 23333, 25000, 26667, 28333, 30000, 31667, 33333, 35000, 36667, 38333, 40000, 41667, 43333, 45000, 46667, 48333, 50000];
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	if (message.content === '!wordcount') {
		if (mm < 11) {
            message.channel.sendMessage(lang.NanoNotStartedYet);
		} else if (mm > 11) {
            message.channel.sendMessage(lang.NanoOver);
		} else {
			var todayWords = nanoWords [dd-1]
            message.channel.sendMessage(lang.todayWordcount + todayWords + ".");
		}
	}
});

// Who da best?
client.on('message', message =>{
	if (message.content.toLowerCase() == 'who da best?') {
		var whoDaBestRand = Math.floor(Math.random() * 100)
		if (whoDaBestRand == 1) {
			message.channel.sendMessage("Omlahid is da best!");
		} else if (whoDaBestRand == 2) {
			message.channel.sendMessage("I am. I am the best.");
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
});

// Cheer! :cheer:
client.on ('message', message =>{
	if (message.content === "!cheer") {
        message.channel.sendMessage(lang.cheeringMessage);
	}
});

// Prompts
client.on ('message', message =>{
	if (message.content === "!prompt") {
		var themes = prompts.writingPrompts;
		var randomNumberRaw = Math.floor(Math.random() * (themes.length) - 1);
		var thisPrompt = themes [randomNumberRaw];
        message.channel.sendMessage(lang.showPrompt + thisPrompt +"\".");
        logMessage(" received prompt number " + randomNumberRaw, message.author.username)
	}
});

// !help or !aide
client.on('message', message =>{
    if (message.content == "!aide" || message.content == "!help")
    message.channel.sendMessage(lang.helpMessage);
});

// Pokemon
client.on('message', message => {
    if (message.content.includes("pokemon")){
        logMessage(" mentionned pokemon", message.author.username);
    }
})

// Glow Cloud
client.on('message', message =>{
	if (message.content.includes("glow cloud")) {
		message.channel.sendMessage("All Hail the Glow Cloud");
        logMessage("All Hail the Glow Cloud", "");
	}
});

// Client token, required for the bot to work
try {
    client.login(token);
}
catch(e) {
    console.log("ERROR: No account was linked to your bot. Please provide a valid authentication token. You can change it in the auth.json file.")
}