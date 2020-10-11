module.exports = {
    addCustomCommand: function (command, response) {
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
        
            if(guildCustomCommands.some(function(e){return e == command})){
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
}




function addCustomCommand(command, response) {
}

/*
{
    "guildprop": {},
    "command": "command",
    "response": "response",
    "": ""
}
*/