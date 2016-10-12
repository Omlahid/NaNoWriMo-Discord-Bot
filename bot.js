var auth = require('./auth.json');

var Discord = require('discord.js');

var prompts = require('./prompts.json');

var bot = new Discord.Client();

var isOrgieStarted = false;

function getCurrentTime() {
	var currentTime = new Date();
	var currentMinutes = currentTime.getMinutes();
	var currentSeconds = currentTime.getSeconds();
	if (currentMinutes < 10) {
		currentMinutes = "0" + currentMinutes;
	}
	if (currentSeconds < 10) {
		currentSeconds = "0" + currentSeconds;
	}
	var timeNow = currentTime.getHours() + ":" + currentMinutes + ":" + currentSeconds;
	console.log("[" + timeNow+ "]");
};

bot.on('message', message => {
	function stopOrgie () {
		// var minutesLeft = 0;
		clearInterval(interval);
		message.channel.sendMessage("@here Fin de l'orgie!");
		getCurrentTime();
		console.log("Orgie over");
		isOrgieStarted = !isOrgieStarted;
	};
	
	function orgieNotOver() {
		if (minutesLeft == 0) {
			stopOrgie();
		} else {
			message.channel.sendMessage("Il reste " + minutesLeft + " minutes à l'orgie!");
			minutesLeft = minutesLeft - 5;
		}
	};
	
	function cannotStartOrgie () {
		message.channel.sendMessage('Une orgie est déjà en court!');
	};
	
	if(message.content === '!orgie 10') {
		if (!isOrgieStarted) {
			isOrgieStarted = !isOrgieStarted;
			var minutesLeft = 5;
			getCurrentTime();
			console.log('10 minute orgie started');
			message.channel.sendMessage('@here Orgie de 10 minutes GO!');
			if (minutesLeft > -1) {
				var interval = setInterval(orgieNotOver, 300000);
			}
		} else {
			cannotStartOrgie();
		}
	}

	if(message.content === '!orgie 15') {
		if (!isOrgieStarted) {
			isOrgieStarted = !isOrgieStarted;
			var minutesLeft = 10;
			getCurrentTime();
			console.log('15 minute orgie started');
			message.channel.sendMessage('@here Orgie de 15 minutes GO!');
			if (minutesLeft > -1) {
				var interval = setInterval(orgieNotOver, 300000);
			}
		} else {
			cannotStartOrgie();
		}
	}
	
	if(message.content === '!orgie 20') {
		if (!isOrgieStarted) {
			isOrgieStarted = !isOrgieStarted;
			var minutesLeft = 15;
			getCurrentTime();
			console.log('20 minute orgie started');
			message.channel.sendMessage('@here Orgie de 20 minutes GO!');
			if (minutesLeft > -1) {
				var interval = setInterval(orgieNotOver, 300000);
			}
		} else {
				cannotStartOrgie();
		}
	}
	
	if(message.content === '!orgie 30') {
		if (!isOrgieStarted) {
			isOrgieStarted = !isOrgieStarted;
			var minutesLeft = 25;
			getCurrentTime();
			console.log('30 minute orgie started');
			message.channel.sendMessage('@here Orgie de 30 minutes GO!');
			if (minutesLeft > -1) {
				var interval = setInterval(orgieNotOver, 300000);
			}
		} else {
			cannotStartOrgie();
		}
	}
	
	function sendMessageAlt() {
		message.channel.sendMessage("test");
	}
});

bot.on('message', message =>{
	var nanoWords = [1667, 3333, 5000, 6667, 8333, 10000, 11667, 13333, 15000, 16667, 18333, 20000, 21667, 23333, 25000, 26667, 28333, 30000, 31667, 33333, 35000, 36667, 38333, 40000, 41667, 43333, 45000, 46667, 48333, 50000];
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	if (message.content === '!wordcount') {
		if (mm < 11) {
			message.channel.sendMessage("NaNoWriMo n'est pas encore commencé.")
		} else if (mm > 11) {
			message.channel.sendMessage("Novembre est fini. À l'année prochaine! :D")
		} else {
			var todayWords = nanoWords [dd-1]
			message.channel.sendMessage("Pour aujourd'hui, le wordcount à atteindre est "+todayWords+".");
		}
	}
});

bot.on('message', message =>{
	if (message.content === 'Who da best?') {
		message.reply('You da best!');
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
	if (message.content === '!aide') {
		message.channel.sendMessage("Bonjour! Je m'appelle Omlabot, codé et roulé par Omlahid!\nVoici ma liste de commandes:\n`!aide`: Pour savoir ma liste de commandes.\n`!orgie 10, 15, 20 ou 30`: Pour commencer une orgie de 10, 15, 20 ou 30 minutes. \n`!wordcount`: Pour savoir il faut avoir combien de mots au total aujourd'hui\n`!prompt`: Pour recevoir un prompt d'écriture. \n`Who da best?`: To know who's the best :) \nEnjoy!");
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
