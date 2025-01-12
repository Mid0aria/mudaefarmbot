/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/*
 * Mudae Farm Bot
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

const cp = require("child_process");
const { logger } = require("./utils/logger.js");

let config,
    accounts,
    DEVELOPER_MODE = false;
try {
    const os = require("os");
    if (
        os.userInfo().username === "Mido" ||
        os.userInfo().username === "enter ur pc username here"
    ) {
        DEVELOPER_MODE = true;
    }

    if (DEVELOPER_MODE) {
        config = require("./developer/config.json");
        accounts = require("./developer/tokens.json");
    } else {
        config = require("./config.json");
        accounts = require("./tokens.json");
    }
} catch (error) {
    console.log("ur bot hosting is gay");
    config = require("./config.json");
}

// auto install dependencies
const isTermux =
    process.env.PREFIX && process.env.PREFIX.includes("com.termux");
const packageJson = require("./package.json");

for (let dep of Object.keys(packageJson.dependencies)) {
    if (isTermux && (dep === "puppeteer" || dep === "puppeteer-real-browser")) {
        console.log("Skipping Puppeteer in Termux environment");
        continue;
    }

    try {
        require.resolve(dep);
    } catch (err) {
        console.log(`Installing dependencies...`);
        try {
            cp.execSync(`npm install ${dep}`, { stdio: "inherit" });
        } catch (installErr) {
            console.error(`Failed to install ${dep}:`, installErr.message);
        }
    }
}

const additionalDeps = ["puppeteer", "puppeteer-real-browser"];

for (let dep of additionalDeps) {
    if (isTermux) {
        console.log(`Termux environment detected. Skipping ${dep}.`);
        continue;
    }

    try {
        require.resolve(dep);
    } catch (err) {
        console.log(`${dep} is not installed. Installing ${dep}...`);
        try {
            cp.execSync(`npm install ${dep}`, { stdio: "inherit" });
        } catch (installErr) {
            console.error(`Failed to install ${dep}:`, installErr.message);
        }
    }
}

const fs = require("fs");
const chalk = require("chalk");
const globalutil = require("./utils/globalutil.js");
const { getRandomBanner } = require("./utils/banner.js");
//client
const { Client, Collection, RichPresence } = require("discord.js-selfbot-v13");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

process.title = `Mudae Farm Bot v${packageJson.version}`;

(async () => {
    console.log(getRandomBanner());
    await globalutil.checkUpdate(logger, cp, packageJson);
    accounts.forEach(async ({ token, channelId }, index) => {
        const client = new Client();

        let mudaefarmbotglobal = {
            name: "mudaefarmbot",
            devmod: DEVELOPER_MODE,
            istermux: isTermux,
            paused: true,
            client: {
                channelid: channelId,
                token: token,
            },
            total: {
                roll: 0,
                vote: 0,
            },

            temp: {
                isready: false,
                started: false,
                voteagaintime: 12 * 60 * 60 * 1000,
                dailyagain: 20 * 60 * 60 * 1000,
                dailykakeraagain: 20 * 60 * 60 * 1000,
                leftrolls: 0,
                rollresetstock: 0,
            },
        };

        client.chalk = chalk;
        client.fs = fs;

        client.childprocess = cp;
        client.config = config;
        client.delay = delay;
        client.global = mudaefarmbotglobal;
        client.rpc = rpc;
        client.logger = logger;
        client.globalutil = globalutil;

        function rpc(type) {
            let status = new RichPresence(client)
                .setApplicationId("1253757665520259173")
                .setType("PLAYING")
                .setName("Mudae Farm Bot")
                .setDetails("Auto Farming")
                .setState(`${client.global.paused ? "Paused" : "Running"}`)
                .setStartTimestamp(Date.now())
                .setAssetsLargeImage("1253758464816054282")
                .setAssetsLargeText("Mudae Farm Bot")
                .addButton(
                    "Farm Bot",
                    "https://github.com/Mid0aria/mudaefarmbot",
                )
                .addButton("Discord", "https://discord.gg/WzYXVbXt6C");

            if (config.discordrpc) {
                client.user.setPresence({ activities: [status] });
                console.log(
                    chalk.blue("RPC") +
                        " > " +
                        chalk.magenta(type) +
                        " > " +
                        chalk.green(
                            `${client.global.paused ? "Paused" : "Running"}`,
                        ),
                );
            }
        }

        ["aliases", "commands"].forEach((x) => (client[x] = new Collection()));

        fs.readdirSync("./handlers").forEach((file) => {
            require(`./handlers/${file}`)(client);
        });
        try {
            logger.warn("Bot", "Startup", "Logging in...");
            await client.login(token);
        } catch (error) {
            logger.error("Bot", "Login", `Invalid Token: ${token}`);
        }
        if (index === accounts.length - 1) {
            logger.warn(
                "Bot",
                "Help",
                `Use \"${config.prefix}start\" to start the bot, \"${config.prefix}resume\" to resume, and \"${config.prefix}pause\" to pause.`,
            );
        }
    });
})();
