# NaNoWriMo-Discord-Bot
**WARNING THIS BOT IS STILL IN EARLY ALPHA. THERE IS NO COMMENT IN THE CODE, AND THERE MIGHT BE SOME BUGS LEFT. THE CREATOR IS STILL ACTIVELY WORKING ON IT 2016/10/11**

This bot (Omlabot) is a small bot I've created. It uses the discord.js library, and is deployed through node.js.

As of 2016/12/10, the bot supports French and English messages. Edit the `auth.json` to change the language.

## I-Know-What-I'm-Doing Documentation

For this bot to work, you need to have node.js 6.0.0+ installed. This is to download [discord.js](https://github.com/hydrabolt/discord.js/), which is required to run this bot.

Then, you need to open the auth.json file, and enter the e-mail and password of the account that will serve as your bot. You then simply need to run `start.bat`.

## I-Have-Never-Done-Anything-Like-This-Before Documentation

1. Ensure you have created an account for your bot, and that this account has been invited to your server.

1. Download [node.js](https://nodejs.org/en/). You need at least version 6.0.0, so use the most recent.

    You need this to download discord.js and also to run the bot itself, although you might not realize it.

2. Download [discord.js](https://github.com/hydrabolt/discord.js/).
    * In Windows, open the command prompt (search for CMD).
    * Enter the following: `node install --save discord.js --production`

3. Once the download is completed, download the file from this github.

4. Open the `auth.json` file. You can simply use notepad for this, or the better version [notepad++](https://notepad-plus-plus.org/download/v7.html).

5. Change the e-mail and the password to an account you created for your bot (recommended).

    You can also enter your own information, in which case you will act as the bot.

6. Save the file.

7. Run `start.bat` by double-clicking it. You should see your bot connected to your server.

8. Type `!help` to know more about the current features (or type `!aide` if you changed the language to French).
