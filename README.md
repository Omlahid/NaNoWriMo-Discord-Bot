# NaNoWriMo-Discord-Bot

This bot (Omlabot) uses the discord.js library, and is deployed through node.js.

The bot comes with English and French support out-of-the-box. Admins can call the `!language` function, followed by either English or French, to change their preferred language. The bot runs in English by default.

The bot supports being on different servers at the same time, even running on different languages per server.

## Functions

* `!help` for help on the bot's usage.

* `!sprint xx` for a sprint, where `xx` is the number of minutes the sprint should last for.

* `!prompt` to get a writing prompt.

* `!my words` to know how many words you have entered on the NaNoWriMo website.

* `!words xx` to know someone else's wordcount (where xx is their NaNoWriMo username).

* `!wordcount` to know the wordcount to get for that day.

* `!cheer` to cheer someone up with a nice gif.

* Other easter eggs and nice goodies :)

## I-Know-What-I'm-Doing Documentation

For this bot to work, you need to have node.js 6.0.0+ installed. This is to install the dependencies
and run the bot.

Then, you need to open the `globalSettings.json` file, and enter the token of the account that will serve as your bot. You then simply need to run `start.bat`.

## I-Have-Never-Done-Anything-Like-This-Before Documentation

1. Ensure you have created an account for your bot, and that this account has been invited to your server.

1. Download [node.js](https://nodejs.org/en/). You need at least version 6.0.0, so use the most recent.

    You need this to install the dependencies and also to run the bot itself, although you might not realize it.

2. Download the files from this GitHub project.

3. Install the dependencies needed for this bot to run.

    a. In Windows, open the command prompt in the folder of the downloaded files (see [Ways to open Command Prompt in a folder in Windows](https://www.thewindowsclub.com/how-to-open-command-prompt-from-right-click-menu)).

    b. In the command prompt window, enter `npm install -g yarn`, and press enter.

    c. Once the previous download has finished, enter `yarn`, and press enter.


4. Open the `globalSettings.json` file. You can simply use notepad for this, or the better version [notepad++](https://notepad-plus-plus.org/download/).

5. Enter the token for your bot. This is a bit tricky, especially since the Discord documentation is not entirely clear, so closely follow these steps.

    **WARNING: Never share your token with anyone. It is sensitive information and should be treated with the same responsibility as a password to your account.**

    a. Log in to your bot account in a browser, and open the console (press `F12` or `Cmd/Ctrl` + `Shift` +`I`).

    b. Select the **Application** tab at the top of the console.

    c. In the tab, expand **Local Storage**, and select `https://discordapp.com`.

    d. You should see a token on the right. Copy paste it in your `auth.json`.

    **WARNING: Never, ever share this token or this file to anyone. The token is essentially an ID card that bypasses the username/password system, and assumes you are already authenticated.**

6. Save the file.

7. Run `start.bat` by double-clicking it. You should see your bot connected to your server.

8. Type `!help` to know more about the current features.

## Changing the Bot Language

Admins can change the language of a bot calling the `!language` function in the chat, followed by either `english` or `french`.

## Adding or Removing Prompts

The `!prompt` command gives you a random prompt to help you kickstart your writing project. All of the prompts are in the `prompts.json` file.

To add or remove more prompts, simply open the `prompts.json` file in your favoured editor, and add or remove what you want.
