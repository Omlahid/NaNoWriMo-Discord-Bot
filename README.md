# NaNoWriMo-Discord-Bot

This bot (Omlabot) uses the discord.js library, and is deployed through node.js.

The bot comes with English and French support out-of-the-box. Edit the `auth.json` to change the language.

You can also add different language. Scroll down for more information.

## I-Know-What-I'm-Doing Documentation

For this bot to work, you need to have node.js 6.0.0+ installed. This is to download [discord.js](https://github.com/hydrabolt/discord.js/), which is required to run this bot.

Then, you need to open the auth.json file, and enter the token of the account that will serve as your bot. You then simply need to run `start.bat`.

## I-Have-Never-Done-Anything-Like-This-Before Documentation

1. Ensure you have created an account for your bot, and that this account has been invited to your server.

1. Download [node.js](https://nodejs.org/en/). You need at least version 6.0.0, so use the most recent.

    You need this to download discord.js and also to run the bot itself, although you might not realize it.

2. Download [discord.js](https://github.com/hydrabolt/discord.js/).

    a. In Windows, open the command prompt (search for CMD).

    b. Enter the following: `npm install --save discord.js`

    While the download may seem to fail due to WARN errors, it should still have completed successfully.

    c. After the previous download finishes, enter the following: `npm install xml2js`

3. Once the download is completed, download the files from this GitHub project.

4. Open the `auth.json` file. You can simply use notepad for this, or the better version [notepad++](https://notepad-plus-plus.org/download/v7.html).

5. Enter the token for your bot. This is a bit tricky, especially since the Discord documentation is not entirely clear, so closely follow these steps.

    **WARNING: Never share your token with anyone. It is sensitive information and should be treated with the same responsibility as a password to your account.**

    a. Log in to your bot account in a browser, and open the console (press `F12` or `Cmd/Ctrl` + `Shift` +`I`).

    b. Select the **Application** tab at the top of the console.

    c. In the tab, expand **Local Storage**, and select `https://discordapp.com`.

    d. You should see a token on the right. Copy paste it in your `auth.json`.

    **WARNING: Never, ever share this token or this file to anyone. The token is essentially an ID card that bypasses the username/password system, and assumes you are already authenticated.**

6. Save the file.

7. Run `start.bat` by double-clicking it. You should see your bot connected to your server.

8. Type `!help` to know more about the current features (or type `!aide` if you changed the language to French).

## Functions

* `!help` for help on the bot's usage.

* `!sprint xx` for a sprint, where `xx` is the number of minutes the sprint should last for.

* `!prompt` to get a writing prompt.

* `!my words` to know how many words you have entered on the NaNoWriMo website.

* `!words xx` to know someone else's wordcount (where xx is their NaNoWriMo username).

* `!wordcount` to know the wordcount to get for that day.

* `!cheer` to cheer someone up with a nice gif.

* Other easter eggs and nice goodies :)

## Changing the Bot Language

Omlabot comes with French and English support out-of-the-box. To switch between them, open the `auth.json` file, and enter `english` or `french`, depending on the language you prefer.

To add a new language and use it for your bot:

1. In the `languages` file, duplicate the `english.json` file.

2. Rename the copy of your file to `yournewlanguage.json`. Ensure the name is in lowercase.

    For instance, if you wanted to add Polish support, your file should be called `polish.json`.

3. Open your new language file with your favoured editor.

4. Translate the second part of each line. A single message might be separated in two different messages, so keep this in mind when translating.

5. Save the file.

6. In the `languages` > `commands` file, duplicate the `english.json` file.

7. Rename the copy of your file the same name as your previously created file.

8. Open your new language file with your favoured editor.

9. Translate the second part of each line. A single message might be separated in two different messages, so keep this in mind when translating.

10. Save the file.

11. In the `auth.json` file, replace `english` (or whichever language you decided to use previously) to the name of your new language file.

    For instance, if you have created a `polish.json` file, you would need to enter `polish`.

12. Save the file.

## Adding or Removing Prompts

The `!prompt` command gives you a random prompt to help you kickstart your writing project. All of the prompts are in the `prompts.json` file.

To add or remove more prompts, simply open the `prompts.json` file in your favoured editor, and add or remove what you want.
