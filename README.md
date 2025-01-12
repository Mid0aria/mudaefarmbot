[You can also look at our OwO Farm Bot](https://github.com/mid0aria/owofarmbot_stable)<br>

dWdnY2Y6Ly9iY3JhLmZjYmd2c2wucGJ6L2dlbnB4LzVwc2tIZ1B4Y3hQVkVlWGxxVVhGb1kgcm90MTM= </br>

<h1 align="center">Mudae Farm Bot V0.0.1(BETA)✒️</h1>
<p align="center">

[![Total Views](https://hits.sh/github.com/Mid0aria/mudaefarmbot.svg?view=today-total&label=Repo%20Today/Total%20Views&color=770ca1&labelColor=007ec6)](https://github.com/Mid0aria/mudaefarmbot)
[![Last Commit](https://img.shields.io/github/last-commit/mid0aria/mudaefarmbot)](https://github.com/Mid0aria/mudaefarmbot)

## Tutorials

### Text

- [🎈・Installation](#Installation)
    - [Windows / Linux](#windows--linux) - Official
    - [Android (Termux)](#android-termux) - Official

If you need the help, join the Discord server [here](https://discord.gg/WzYXVbXt6C)

<!-- To get auth key, join the Discord server [here](https://discord.gg/WzYXVbXt6C), go to [`#🤖・bot-commands`](https://discord.com/channels/1202294695091507230/1203705738770256032), and send `s!key`. The official bot will directly message you with the key. -->

</p>

# Contents

[⭐・Star History](#star-history)<br>

[❗・Important](#important-anyone-using-the-bot-is-deemed-to-have-read-and-accepted-these)<br>

[👑・Features](#features)<br>

[⚙・Tokens.json example](#tokensjson-example)<br>

[⚙・Config.json example](#configjson-example)<br>

[💎・Get Token](#get-token)<br>

[📚・Discord RPC](#discord-rpc)<br>

[⚠️・Captcha Alert](#captcha-alert)<br>

[🔗・Required Links](#required-links)<br>

[🎈・Installation](#installation)<br>

[🥰・Contributors](#contributors)<br>

[📑・License](#license)<br>

[🤓・For the curious](#for-the-curious)<br>

## ⭐・Star History

<h2 align="center">Goal: <a href="https://github.com/Mid0aria/mudaefarmbot/stargazers"><img src="https://img.shields.io/github/stars/Mid0aria/mudaefarmbot" /></a> / 512</h2>
⭐⭐⭐ You can also give this repository a star so that others know we're trusted!<br>

[![Star History Chart](https://api.star-history.com/svg?repos=Mid0aria/mudaefarmbot&type=Date)](https://star-history.com/#Mid0aria/mudaefarmbot&Date)

## ❗・Important (Anyone using the bot is deemed to have read and accepted these)

- Use of this farm bot may lead to actions being taken against your Mudae profile and/or your Discord account. We are not responsible for them.

## 👑・Features

- Multi Account Support
- Auto Roll
- Auto ReRoll (from stock)
- Auto claims rolls if they are at the desired rank threshold
- Auto Daily
- Auto Daily Kakera
- Auto Vote

## ⚙・tokens.json example

```
you can add as many tokens as you want this way (channel ids must be different!)
[
    { "token": "TOKEN1", "channelId": "CHANNELID1" },
    { "token": "TOKEN2", "channelId": "CHANNELID2" },
    { "token": "TOKEN3", "channelId": "CHANNELID3" }
]

```

## ⚙・config.json example

```
{
    "prefix": "!", / SelfBot PREFIX
    "discordrpc": true, / true or false (boolean)
    "chatfeedback": true, / true or false (boolean)
    "autostart": true, / set to true if you want the farm bot to run as soon as you run the code, true or false (boolean)
    "autovote": true, / true or false (boolean)
    "daily": true, / true or false (boolean)
    "dailykakera": true, / true or false (boolean)
    "roll": {
        "rank": "99000", / adjust according to which claim or like rank you want to claim
        "male": false, / true or false (boolean)
        "female": true, / true or false (boolean)
        "both": false / true or false (boolean)
    }
}

```

## 💎・Get Token

[Geeks for Geeks - How to get discord token](https://www.geeksforgeeks.org/how-to-get-discord-token/)

### PC

1. Open your preferred browser (with developer tools) and login to https://discord.com/app
2. Press CTRL + Shift + I and open the Console tab.
3. Paste the following code.
4. The text returned (excluding the quotes `'`) will be your Discord account token.

```js
(webpackChunkdiscord_app.push([
    [""],
    {},
    (e) => {
        for (let t in ((m = []), e.c)) m.push(e.c[t]);
    },
]),
m)
    .find((e) => e?.exports?.default?.getToken !== void 0)
    .exports.default.getToken();
```

### Mobile/Android

1. Open Chrome
2. Create a bookmark (by clicking on star button in 3 dots menu)
3. Edit it and set name to Token Finder and url to the following code:
    ```javascript
    javascript: (webpackChunkdiscord_app.push([[""],{},(e)=>{m=[];for (let c in e.c) m.push(e.c[c]);},]),m).find((m) => m?.exports?.default?.getToken%20!==%20void%200)%20%20%20%20.exports.default.getToken();
    ```
4. Open https://discord.com/app and log in.
5. Tap on search bar and type Token Finder (don't search it just type)
6. Click on the bookmark named Token Finder.
7. A new page will open, the text in the page will be your Discord account token.

## 🔗・Required Links

[NodeJS](https://nodejs.org/en/)<br>
[Terminal](https://apps.microsoft.com/detail/9n0dx20hk701)<br>
[Farm Bot ZIP File](https://github.com/Mid0aria/mudaefarmbot/archive/refs/heads/main.zip)

## 🎈・Installation

### 💻・Windows / Linux

```bash
# Check Node.js version:
node -v

# Clone the files with git:
git clone https://github.com/Mid0aria/mudaefarmbot
# Optionally you can also download from github at https://github.com/Mid0aria/mudaefarmbot/archive/refs/heads/main.zip

# Enter into the cloned directory:
cd mudaefarmbot

# Configure the bot:
notepad config.json # On windows
nano config.json # On linux, can also use any other preferred file writing software

# Run the bot:
node bot.js

# Start Bot:
In config.json, type [prefix]start (example: e!start) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Stop Bot:
In config.json, type [prefix]stop (example: e!stop) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Resume Bot:
In config.json, type [prefix]resume (example: e!resume) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Bot Stats:
In config.json, type [prefix]stats (example: e!stats) with the prefix you set in config.json to the channel whose ID you entered in channelid
```

### 📱・Android / iOS (Termux)

```bash
# Install:
apt update -y && apt upgrade -y
curl https://raw.githubusercontent.com/mid0aria/mudaefarmbot/main/termux-setup.sh | bash


# Configure the bot:

cd mudaefarmbot
nano config.json

# Run the bot:
sh start.sh
or
node bot.js

# Start Bot:
In config.json, type [prefix]start (example: e!start) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Stop Bot:
In config.json, type [prefix]stop (example: e!stop) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Resume Bot:
In config.json, type [prefix]resume (example: e!resume) with the prefix you set in config.json to the channel whose ID you entered in channelid

# Bot Stats:
In config.json, type [prefix]stats (example: e!stats) with the prefix you set in config.json to the channel whose ID you entered in channelid
```

## 📑・License

[Mudae Farm Bot](https://github.com/Mid0aria/mudaefarmbot) is licensed under the terms of [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://github.com/Mid0aria/mudaefarmbot/blob/main/LICENSE) ("CC-BY-NC-SA-4.0"). Commercial use is not allowed under this license. This includes any kind of revenue made with or based upon the software, even donations.

The CC-BY-NC-SA-4.0 allows you to:

- [x] **Share** -- copy and redistribute the material in any medium or format
- [x] **Adapt** -- remix, transform, and build upon the material

Under the following terms:

- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- **NonCommercial** — You may not use the material for commercial purposes.
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

More information can be found [here](https://creativecommons.org/licenses/by-nc-sa/4.0/).
