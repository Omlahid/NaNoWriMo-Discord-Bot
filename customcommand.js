    /*
    // Refactor of code for custom commands
    if (message.content.startsWith("!!custom") && isUserAdmin(message.member)) {
        console.log("The command was called");
        if (message.content.toLowerCase() == "!!custom list") {
            // TODO: Return the list of custom commands
            console.log("Asking for command list");
            if (customCommands[guildprop.id].length > -1) {
                const prettyListOfCustomCommands = "Here is the list of custom commands:\n";
                customCommands[guildprop.id].forEach(command => {
                    const messageToAdd = "- " + command + "\n";
                    customCommands += messageToAdd;
                });
                message.channel.send(prettyListOfCustomCommands);
            } else {
                message.channel.send("There are no custom commands set on this server.")
            }
        } else {
            const messageArgs = message.content.split("--");
            const determineCustomCommand = message.content.split(" ");
            if (!messageArgs[2] || messageArgs[1].trim() == "" || messageArgs[2].trim() == "") {
                if (determineCustomCommand[1] == "delete") {
                    if (!determineCustomCommand[2]) {
                        message.channel.send("You need to specify a custom command to delete")
                    } else {
                        console.log("Trying to delete a command");
                        if (customCommands.indexOf(messageArgs[1])) {
                            const commandIndex = customCommands.indexOf(messageArgs[1])
                            customCommands.splice(commandIndex, 1);
                            customResponses.splice(commandIndex, 1);
                            message.channel.send("The custom command was deleted.");
                        } else {
                            message.channel.send("The command you want to remove from the channel does not exist.");
                        }
                    }
                } else {
                    console.log("Trying to add a command");
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
        }
    }*/