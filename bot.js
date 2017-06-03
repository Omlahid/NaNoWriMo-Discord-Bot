var auth = require('./auth.json');

var Discord = require('discord.js');

var prompts = require('./prompts.json');

var client = new Discord.Client();

var isSprintStarted = false;

var language = auth.language;

var token = auth.token;

// The two following variables are used only for the 'Who da best?' function

var currentMessageAuthorTime = 0;

var currentMessageAuthor = 0;

if (language == "fr") {
	console.log("French language detected. Logs are still in English.");
} else if (language == "en") {
	console.log("English language detected.");
} else {
	console.log("Language could not be detected. Defaulting to English.");
}

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
        if (language == "fr") {
            message.channel.sendMessage("@here Fin du sprint!");
        } else {
            message.channel.sendMessage("@here End of the sprint!");
        }
        isSprintStarted = !isSprintStarted;
        logMessage("Sprint finished", "");
    }

    function sendRemainingSprintTime(x, min) {
        // Functions that send messages to the channel have to be declared in the message. Otherwise 'message' is not defined
        var minutesRemainingInTotal = min - ((x - 1) * 5) // A bit of math to calculate the right amount of time left
        setTimeout(function () {
            if (language == "fr") {
                message.channel.sendMessage("Il reste " + minutesRemainingInTotal + " minutes au sprint!")
            } else {
                message.channel.sendMessage(minutesRemainingInTotal + " minutes left to the sprint!")
            }
        }, x * 300000); // 5000 for seconds (testing purposes), 300000 for minutes
    }

    if (message.content.startsWith("!sprint")) {
        if (isSprintStarted) {
            if (language == "fr") {
                message.channel.sendMessage('Un sprint est déjà en court!');
            } else {
                message.channel.sendMessage("A sprint is already underway!");
            }
        } else {
            var sprintTimeDemanded = message.content.substring(8);
            if (sprintTimeDemanded % 5 == 0) {
                if (sprintTimeDemanded > 60) {
                    if (language == "fr") {
                        message.channel.sendMessage("Ce sprint est trop long (maximum d'une heure).")
                    } else {
                        message.channel.sendMessage("That sprint is too long (the maximum is one hour).")
                    }
                } else {
                    if (language == "fr") {
                        message.channel.sendMessage("@here Sprint de " + sprintTimeDemanded + " minutes GO!")
                    } else {
                        message.channel.sendMessage("@here " + sprintTimeDemanded + " minute sprint GO!")
                    }
                    isSprintStarted = !isSprintStarted;
                    logMessage("asked for a " + sprintTimeDemanded + " minute sprint", message.author.username);
                    // 60000 is for minutes, 1000 is for seconds (testing purposes)
                    setTimeout(sprintEnded, sprintTimeDemanded * 60000)
                    var minutesLeftToSprint = sprintTimeDemanded - 5;
                    for (var x = 1, ln = sprintTimeDemanded / 5; x < ln; x++ , minutesLeftToSprint - 5) {
                        sendRemainingSprintTime(x, minutesLeftToSprint);
                    }
                }
            } else {
                if (language == "fr") {
                    message.channel.sendMessage("Les sprints se font par intervalle de 5 minutes.")
                } else {
                    message.channel.sendMessage("You can only ask for five minute intervals.");
                }
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
			if (language == "fr") {
				message.channel.sendMessage("NaNoWriMo n'est pas encore commencé.");
			} else {
				message.channel.sendMessage("NaNoWriMo hasn't started yet.");
			}
		} else if (mm > 11) {
			if (language == "fr") {
				message.channel.sendMessage("NaNoWriMo est fini. À l'année prochaine! :D");
			} else {
				message.channel.sendMessage("NaNoWriMo is over. See you next year! :D");
			}
		} else {
			var todayWords = nanoWords [dd-1]
			if (language == "fr") {
				message.channel.sendMessage("Pour aujourd'hui, le wordcount à atteindre est "+todayWords+".");
			} else {
				message.channel.sendMessage("The wordcount for today is "+todayWords+".");
			}
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
				message.reply("Stop asking me who the best one is! :angry:");
			} else {
				message.reply('You da best!')
			}
		}
	}
});

// Cheer! :cheer:
client.on ('message', message =>{
	if (message.content === "!cheer") {
		message.channel.sendMessage("You can do it! https://38.media.tumblr.com/91599091501f182b0fbffab90e115895/tumblr_nq2o6lc0Kp1s7widdo1_250.gif")
	}
});

// Prompts
client.on ('message', message =>{
	if (message.content === "!prompt") {
		var themes = prompts.writingPrompts;
		var randomNumberRaw = Math.floor(Math.random() * (themes.length) - 1);
		var thisPrompt = themes [randomNumberRaw];
		message.channel.sendMessage('Your prompt is "' + thisPrompt +'"');
        logMessage(" received prompt number " + randomNumberRaw, message.author.username)
	}
});

// !help or !aide
client.on('message', message =>{
	if (language == "fr") {
		if (message.content === '!aide') {
			message.channel.sendMessage("Bonjour! Je m'appelle Omlabot!\nVoici ma liste de commandes:\n`!aide`: Pour savoir ma liste de commandes.\n`!sprint 10, 15, 20 ou 30`: Pour commencer un sprint de 10, 15, 20 ou 30 minutes. \n`!wordcount`: Pour savoir il faut avoir combien de mots au total aujourd'hui\n`!prompt`: Pour recevoir un prompt d'écriture. \n`!cheer`: To cheer you up\n`Who da best?`: To know who's the best :) \nEnjoy!");
			}
		}
	if (language == "en") {
		if (message.content === "!help") {
			message.channel.sendMessage("Hi! My name is Omlabot!\nHere is my command list:\n`!help`: To know my command list.\n`!sprint 10, 15, 20, or 30`: To start a 10, 15, 20, or 30 minute sprint.\n`!wordcount`: To know the wordcount to achieve for today.\n`!prompt`: To get a random writing prompt.\n`!cheer`: To cheer you up\n`Who da best?`: To know who's the best :) \nEnjoy!");
			}
		}
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
client.login(token);
