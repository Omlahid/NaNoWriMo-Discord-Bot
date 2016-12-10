var auth = require('./auth.json');

var Discord = require('discord.js');

var prompts = require('./prompts.json');

var bot = new Discord.Client();

var isSprintStarted = false;

var language = auth.language;

if (language == "fr") {
	console.log("French language detected. Logs are still in English.");
} else if (language == "en") {
	console.log("English language detected.");
} else {
	console.log("Language could not be detected. Defaulting to English.");
}

function getCurrentTime() {
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
	console.log("[" + timeNow+ "]");
};

bot.on('message', message => {
	function stopSprint () {
		// var minutesLeft = 0;
		clearInterval(interval);
		if (language == "fr") {
			message.channel.sendMessage("@here Fin du sprint!");
		} else {
			message.channel.sendMessage("@here End of the sprint!");
		}
		getCurrentTime();
		console.log("Sprint over");
		isSprintStarted = !isSprintStarted;
	};
	
	function SprintNotOver() {
		if (minutesLeft == 0) {
			stopSprint();
		} else {
			if (language == "fr") {
				message.channel.sendMessage("Il reste " + minutesLeft + " minutes au sprint!")
			} else {
				message.channel.sendMessage(minutesLeft + " minutes left to the sprint!")
			}
			minutesLeft = minutesLeft - 5;
		}
	};
	
	function cannotStartSprint () {
		if (language == "fr") {
			message.channel.sendMessage('Un sprint est déjà en court!');
		} else {
			message.channel.sendMessage("A sprint is already underway!");
		}
	};
	
	if(message.content === '!sprint 10') {
		if (!isSprintStarted) {
			isSprintStarted = !isSprintStarted;
			var minutesLeft = 5;
			getCurrentTime();
			console.log('10 minute sprint started');
			if (language == "fr") {
				message.channel.sendMessage('@here Sprint de 10 minutes GO!');
			} else {
				message.channel.sendMessage("@here 10 minute sprint GO!");
			}
			if (minutesLeft > -1) {
				var interval = setInterval(sprintNotOver, 300000);
			}
		} else {
			cannotStartSprint();
		}
	}

	if(message.content === '!sprint 15') {
		if (!isSprintStarted) {
			isSprintStarted = !isSprintStarted;
			var minutesLeft = 10;
			getCurrentTime();
			console.log('15 minute sprint started');
			if (language == "fr") {
				message.channel.sendMessage('@here Sprint de 15 minutes GO!');
			} else {
				message.channel.sendMessage("@here 15 minute sprint GO!");
			}
			if (minutesLeft > -1) {
				var interval = setInterval(SprintNotOver, 300000);
			}
		} else {
			cannotStartSprint();
		}
	}
	
	if(message.content === '!sprint 20') {
		if (!isSprintStarted) {
			isSprintStarted = !isSprintStarted;
			var minutesLeft = 15;
			getCurrentTime();
			console.log('20 minute sprint started');
			if (language == "fr") {
				message.channel.sendMessage('@here Sprint de 20 minutes GO!');
			} else {
				message.channel.sendMessage("@here 20 minute sprint GO!");
			}
			if (minutesLeft > -1) {
				var interval = setInterval(sprintNotOver, 300000);
			}
		} else {
				cannotStartSprint();
		}
	}
	
	if(message.content === '!sprint 30') {
		if (!isSprintStarted) {
			isSprintStarted = !isSprintStarted;
			var minutesLeft = 25;
			getCurrentTime();
			console.log('30 minute sprint started');
			if (language == "fr") {
				message.channel.sendMessage('@here Sprint de 30 minutes GO!');
			} else {
				message.channel.sendMessage("@here 30 minute sprint GO!");
			}
			if (minutesLeft > -1) {
				var interval = setInterval(sprintNotOver, 300000);
			}
		} else {
			cannotStartSprint();
		}
	}
});

bot.on('message', message =>{
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

bot.on('message', message =>{
	if (message.content === 'Who da best?') {
		var whoDaBestRand = Math.floor(Math.random() * 100)
		if (whoDaBestRand == 1) {
			message.channel.sendMessage("Omlahid is da best!");
		} else if (whoDaBestRand == 2) {
			message.channel.sendMessage("I am. I am the best.");
		} else {
			message.reply('You da best!')
		}
	}
});

bot.on ('message', message =>{
	if (message.content === "!cheer") {
		message.channel.sendMessage("You can do it! https://38.media.tumblr.com/91599091501f182b0fbffab90e115895/tumblr_nq2o6lc0Kp1s7widdo1_250.gif")
	}
});

bot.on ('message', message =>{
	if (message.content === "!prompt") {
		var themes = prompts.writingPrompts;
		var randomNumberRaw = Math.floor(Math.random() * (themes.length) - 1);
		var thisPrompt = themes [randomNumberRaw];
		message.channel.sendMessage('Your prompt is "' + thisPrompt +'"');
	}
});

bot.on('message', message =>{
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

bot.on('message', function(message){
	if (message.content.includes("pokemon")) {
		getCurrentTime();
		console.log("Someone talked about Pokemon");
	}
});

bot.on('message', message =>{
	if (message.content.includes("glow cloud")) {
		message.channel.sendMessage("All Hail the Glow Cloud");
		getCurrentTime();
		console.log("All Hail the Glow Cloud");
	}
});

bot.login(auth.email, auth.password);
