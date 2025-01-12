/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/*
 * Mudae Farm Bot
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

module.exports = async (client) => {
    client.logger.info(
        "Bot",
        "Startup",
        client.chalk.red(`${client.user.username}`) + " is ready!",
    );

    client.global.temp.isready = true;

    client.rpc("start");
    if (client.config.autostart) {
        if (client.global.paused) {
            client.global.paused = false;
            client.rpc("update");

            if (!client.global.temp.started) {
                client.global.temp.started = true;
                client.logger.info(
                    "Bot",
                    "AutoStart",
                    "BOT started have fun ;)",
                );

                setTimeout(() => {
                    require("../../utils/mainHandler.js")(client);
                }, 1000);
            } else {
                client.logger.info(
                    "Bot",
                    "AutoStart",
                    "Restarted BOT after a pause :3",
                );
            }
        } else {
            client.logger.warn("Bot", "AutoStart", "Bot is already working!!!");
        }
    }
};
