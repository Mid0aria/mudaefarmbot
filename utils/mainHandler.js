/*
 * Mudae Farm Bot
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */
const path = require("path");
module.exports = async (client) => {
    if (client.global.paused) {
        while (true) {
            if (!client.global.paused) break;
            await client.delay(3000);
        }
    }

    let channel = client.channels.cache.get(client.global.client.channelid);
    await tucheck(client, channel);
};

async function tucheck(client, channel) {
    if (client.global.paused) return;
    let id;
    channel.sendTyping();
    await channel
        .send({
            content: `$tu`,
        })
        .then(async (clmsg) => {
            id = clmsg.id;
            client.logger.info("Farm", "Tu", `Reading Tu`);
            let message = await getMessage();
            async function getMessage() {
                return new Promise((resolve) => {
                    const filterphrases = [
                        "next rolls reset",
                        "each kakera reaction consumes",
                        "$tuarrange",
                    ];
                    const filter = (msg) =>
                        filterphrases.some((phrase) =>
                            msg.content.toLowerCase().includes(phrase),
                        ) &&
                        msg.author.id === "432610292342587392" &&
                        msg.channel.id === channel.id &&
                        msg.id.localeCompare(id) > 0;

                    const listener = (msg) => {
                        if (filter(msg)) {
                            clearTimeout(timer);
                            client.off("messageCreate", listener);
                            resolve(msg);
                        }
                    };

                    const timer = setTimeout(() => {
                        client.logger.warn("Farm", "Tu", "Rechecking Tu...");
                        client.off("messageCreate", listener);
                        const collector = channel.createMessageCollector({
                            filter,
                            time: 11600,
                        });
                        collector.on("collect", (msg) => {
                            if (filter(msg)) {
                                collector.stop();
                                resolve(msg);
                            }
                        });
                        collector.on("end", () => resolve(null));
                    }, 10000);

                    client.on("messageCreate", listener);
                });
            }

            if (message == null) {
                client.logger.alert("Farm", "Tu", "Cannot retrieve Tu.");
                return;
            }

            let tucontents = message.content.toLowerCase();

            if (client.config.daily) {
                if (tucontents.includes("$daily reset in")) {
                    const dailyagainregex =
                        /\$daily\s+reset\s+in\s+\*\*(\d+)\s*h\s*(\d+)\*\*\s*min|\$daily\s+reset\s+in\s+\*\*(\d+)\*\*\s*min/;
                    const match = tucontents.match(dailyagainregex);

                    if (match) {
                        const hours = match[1] ? parseInt(match[1], 10) : 0;
                        const minutes = match[2]
                            ? parseInt(match[2], 10)
                            : match[3]
                              ? parseInt(match[3], 10)
                              : 0;

                        const milliseconds =
                            hours * 60 * 60 * 1000 + minutes * 60 * 1000;
                        client.global.temp.dailyagain = milliseconds;
                        client.logger.warn(
                            "Farm",
                            "Tu - Daily ",
                            `Daily claimed in advance. It will restart in ${client.global.temp.dailyagain} milliseconds`,
                        );
                    }
                    require("./function/daily.js")(client, channel, "reclaim");
                } else {
                    require("./function/daily.js")(client, channel);
                }
            }
            await client.delay(4500);

            if (client.config.autovote) {
                if (tucontents.includes("you may vote right now")) {
                    client.logger.info(
                        "Farm",
                        "Tu - Vote",
                        `Platform: ${process.platform}`,
                    );
                    switch (process.platform || client.global.istermux) {
                        case "android":
                            client.logger.warn(
                                "Bot",
                                "Tu - Vote",
                                "Unsupported platform!",
                            );
                            break;
                        default:
                            client.logger.info(
                                "Bot",
                                "Tu - Vote",
                                "Opening automated chromium browser...",
                            );

                            client.childprocess.spawn("node", [
                                path.join(__dirname, "./autovote.js"),
                                `--token=${client.global.client.token}`,
                                `--bid=432610292342587392`,
                            ]);
                            client.global.total.vote++;
                            client.global.temp.rollresetstock++;
                            break;
                    }
                } else if (tucontents.includes("you may vote again in")) {
                    const voteAgainRegex =
                        /vote again in \*\*(\d+)h\s(\d+)min\*\*/;
                    const match = tucontents.match(voteAgainRegex);

                    if (match) {
                        const hours = parseInt(match[1], 10);
                        const minutes = parseInt(match[2], 10);

                        const milliseconds =
                            hours * 60 * 60 * 1000 + minutes * 60 * 1000;
                        client.global.temp.voteagaintime = milliseconds;
                        client.logger.warn(
                            "Farm",
                            "Tu- Vote",
                            `Previously Voted. It will restart in ${client.global.temp.voteagaintime} milliseconds`,
                        );
                    }
                    setTimeout(() => {
                        client.logger.info(
                            "Farm",
                            "Tu - Vote",
                            `Platform: ${process.platform}`,
                        );
                        switch (process.platform || client.global.istermux) {
                            case "android":
                                client.logger.warn(
                                    "Bot",
                                    "Tu - Vote",
                                    "Unsupported platform!",
                                );
                                break;
                            default:
                                client.logger.info(
                                    "Bot",
                                    "Tu - Vote",
                                    "Opening automated chromium browser...",
                                );

                                client.childprocess.spawn("node", [
                                    path.join(__dirname, "./autovote.js"),
                                    `--token=${client.global.client.token}`,
                                    `--bid=432610292342587392`,
                                ]);
                                client.global.total.vote++;
                                break;
                        }
                    }, client.global.temp.voteagaintime);
                }
            }
            await client.delay(4500);

            if (client.config.dailykakera) {
                if (tucontents.includes("$dk is ready")) {
                    require("./function/dailykakera.js")(client, channel);
                } else if (tucontents.includes("$dk reset in")) {
                    const dailykakeraagainregex =
                        /$dk reset in \*\*(\d+)h\s(\d+)min\*\*/;
                    const match = tucontents.match(dailykakeraagainregex);

                    if (match) {
                        const hours = parseInt(match[1], 10);
                        const minutes = parseInt(match[2], 10);

                        const milliseconds =
                            hours * 60 * 60 * 1000 + minutes * 60 * 1000;
                        client.global.temp.dailykakeraagain = milliseconds;
                        client.logger.warn(
                            "Farm",
                            "Tu - Daily Kakera",
                            `Daily kakera claimed in advance. It will restart in ${client.global.temp.dailykakeraagain} milliseconds`,
                        );
                    }
                    require("./function/dailykakera.js")(
                        client,
                        channel,
                        "reclaim",
                    );
                }
            }

            await client.delay(2500);

            if (
                tucontents.includes("rolls left") ||
                tucontents.includes("roll left")
            ) {
                const rollsleftmatch = tucontents.match(
                    /you have \*\*(\d+)\*\* rolls left\./,
                );
                const rollsresetmatch = tucontents.match(
                    /rolls reset in \*\*(\d+)\*\* min/,
                );

                if (rollsleftmatch) {
                    const rollsLeft = parseInt(rollsleftmatch[1], 10);
                    client.global.temp.leftrolls = rollsLeft;
                }
                if (rollsresetmatch) {
                    const minutes = rollsresetmatch[1];
                    const milliseconds = minutes * 60 * 1000;
                    client.global.temp.rollresettime = milliseconds;
                    client.logger.info(
                        "Farm",
                        "Roll",
                        `Next rolls reset in: ${minutes} minutes`,
                    );
                }
                await client.delay(2500);
                channel.sendTyping();
                await channel
                    .send({
                        content: `$vote`,
                    })
                    .then(async (clmsg) => {
                        let id = clmsg.id;
                        let message = await getMessage();
                        async function getMessage() {
                            return new Promise((resolve) => {
                                const filterphrases = ["You may vote again in"];
                                const filter = (msg) =>
                                    filterphrases.some((phrase) =>
                                        msg.content.includes(phrase),
                                    ) &&
                                    msg.author.id === "432610292342587392" &&
                                    msg.channel.id === channel.id &&
                                    msg.id.localeCompare(id) > 0;

                                const listener = (msg) => {
                                    if (filter(msg)) {
                                        clearTimeout(timer);
                                        client.off("messageCreate", listener);
                                        resolve(msg);
                                    }
                                };

                                const timer = setTimeout(() => {
                                    client.logger.warn(
                                        "Farm",
                                        "Roll",
                                        "Rechecking Roll Stock...",
                                    );
                                    client.off("messageCreate", listener);
                                    const collector =
                                        channel.createMessageCollector({
                                            filter,
                                            time: 11600,
                                        });
                                    collector.on("collect", (msg) => {
                                        if (filter(msg)) {
                                            collector.stop();
                                            resolve(msg);
                                        }
                                    });
                                    collector.on("end", () => resolve(null));
                                }, 10000);

                                client.on("messageCreate", listener);
                            });
                        }
                        const rollsRegex =
                            /You have \*\*(\d+)\*\* rolls reset in stock/;

                        const match = message.content.match(rollsRegex);
                        const rollsInStock = match ? parseInt(match[1], 10) : 0;
                        client.global.temp.rollresetstock = rollsInStock;
                        client.logger.info(
                            "Farm",
                            "Roll",
                            `${rollsInStock} roll resetter in stock`,
                        );
                    });
                await client.delay(2500);
                if (client.global.temp.leftrolls > 0) {
                    require("./function/roll.js")(client, channel);
                } else if (client.global.temp.rollresetstock > 0) {
                    require("./function/roll.js")(client, channel, "reset");
                } else {
                    client.logger.info(
                        "Farm",
                        "Roll",
                        `waiting for the rolls to reset: ${client.global.temp.rollresettime} miliseconds`,
                    );
                    setTimeout(() => {
                        require("./function/roll.js")(client, channel);
                    }, client.global.temp.rollresettime);
                }
            }
        });
}
