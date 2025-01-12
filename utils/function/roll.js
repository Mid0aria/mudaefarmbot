module.exports = async (client, channel, type = null) => {
    if (type === "reset") {
        await reset(client, channel);
    } else {
        await roll(client, channel);
    }
};

async function roll(client, channel) {
    if (client.global.paused) return;

    channel.sendTyping();
    let rollcommand;
    let rollconfig = client.config.roll;
    switch (true) {
        case rollconfig.both || (rollconfig.male && rollconfig.female):
            rollcommand = "m";
            break;
        case rollconfig.male:
            rollcommand = "h";
            break;
        case rollconfig.female:
            rollcommand = "w";
            break;
        default:
            rollcommand = "w"; //🐈mrr :)
            break;
    }

    await channel
        .send({
            content: `$${rollcommand}`,
        })
        .then(async (clmsg) => {
            client.logger.warn("Farm", "Roll", `Getting Roll`);
            let id = clmsg.id;
            let message = await getMessage();
            async function getMessage() {
                return new Promise((resolve) => {
                    const filterphrases = ["Claims", "Likes", "emoji to claim"];

                    const filter = (msg) =>
                        msg.embeds[0] &&
                        filterphrases.some((phrase) =>
                            msg.embeds[0].description.includes(phrase),
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
                            "Rechecking Roll...",
                        );
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
                client.logger.alert("Farm", "Roll", "Cannot retrieve Roll.");
                return;
            }
            const regex = /Claims: #(\d+)\s+Likes: #(\d+)\s+\*\*(\d+)\*\*/;
            const description = message.embeds[0].description;

            const match = description.match(regex);
            let claims, likes;
            if (match) {
                claims = parseInt(match[1], 10);
                likes = parseInt(match[2], 10);
                // const kakera = parseInt(match[3], 10)
            }
            // console.log(
            //     `Claims: ${claims} ${client.config.roll.rank} | ${claims < client.config.roll.rank}, Likes: ${likes} ${likes < client.config.roll.rank}`,
            // );
            if (
                claims < client.config.roll.rank ||
                likes < client.config.roll.rank
            ) {
                await client.delay(2500);
                await claim(client, channel, message);
            } else {
                await client.delay(2500);
                await roll(client, channel);
            }
        });
}

async function claim(client, channel, message) {
    let rollmessage = message;
    client.logger.warn("Farm", "Roll", `Roll Claiming`);
    const emojis = ["👍", "💎", "🔥", "🎉", "❤️", "🌟", "💯", "🥵"];
    const kakeraEmojis = [
        ":kakeraP:",
        ":kakera:",
        ":kakeraT:",
        ":kakeraG:",
        "kakeraY:",
        "kakeraO:",
        ":kakeraR:",
        ":kakeraW:",
        ":kakeraL:",
    ];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    message.react(randomEmoji).then(async () => {
        const button = rollmessage.components[0]?.components[0];

        if (button) {
            const emoji = button.emoji.name;

            if (kakeraEmojis.includes(emoji)) {
                button
                    .click()
                    .then(() =>
                        client.logger.info(
                            "Farm",
                            "Roll",
                            `Kakera Emoji Found and Clicked`,
                        ),
                    )
                    .catch((err) =>
                        console.error("Error clicking the button:", err),
                    );
            }
        }

        let intervalmessage = await getintervalMessage();
        async function getintervalMessage() {
            return new Promise((resolve) => {
                const filterphrases = [
                    "you can claim once per interval of",
                    "next interval begins in",
                ];

                const filter = (msg) =>
                    filterphrases.some((phrase) =>
                        msg.content.includes(phrase),
                    ) &&
                    msg.content.includes(`<@${client.user.id}>`) &&
                    msg.author.id === "432610292342587392" &&
                    msg.channel.id === channel.id;

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
                        "Rechecking Roll Interval...",
                    );
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

        if (intervalmessage == null) {
            client.logger.info("Farm", "Roll", `Roll Claimed`);
            await client.delay(2500);
            await checkleftrolls(client, channel);
        }
        const timeRegex = /next interval begins in \*\*(\d+h )?(\d+)?\*\* min/i;

        const match = intervalmessage.content.match(timeRegex);

        if (match) {
            const hours = match[1]
                ? parseInt(match[1].replace("h", "").trim())
                : 0;
            const minutes = match[2] ? parseInt(match[2]) : 0;

            const milliseconds = hours * 60 * 60 * 1000 + minutes * 60 * 1000;

            client.logger.warn(
                "Farm",
                "Roll",
                `The next claim may occur after ${milliseconds} milliseconds`,
            );

            setTimeout(async () => {
                await client.delay(2500);
                await checkleftrolls(client, channel);
            }, milliseconds);
        } else {
            console.log("I PROBABLY COULDN'T READ THE INTERVAL MESSAGE");
            await client.delay(2500);
            await checkleftrolls(client, channel);
        }
    });
}

async function reset(client, channel) {
    if (client.global.paused) return;
    channel.sendTyping();
    await channel
        .send({
            content: `$rolls`,
        })
        .then(async (clmsg) => {
            let id = clmsg.id;
            let message = await getMessage();
            async function getMessage() {
                return new Promise((resolve) => {
                    const filterphrases = [
                        "to reset your rolls timer",
                        "rolls timer for ONE",
                    ];

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
                            "Rechecking Roll Reset...",
                        );
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
                client.logger.info("Farm", "Roll", `Roll reset`);
                client.global.temp.rollresetstock--;
                await client.delay(2500);
                await roll(client, channel);
            }
        });
}

async function checkleftrolls(client, channel) {
    if (client.global.paused) return;
    client.logger.warn("Farm", "Roll", `Checking Left Rolls`);
    channel.sendTyping();
    await channel
        .send({
            content: `$ru`,
        })
        .then(async (clmsg) => {
            let resettime = 60 * 60 * 1000;
            let id = clmsg.id;
            let message = await getMessage();
            async function getMessage() {
                return new Promise((resolve) => {
                    const filterphrases = ["rolls left", "Next rolls reset in"];
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
                        client.logger.warn(
                            "Farm",
                            "Roll",
                            "Rechecking Left Rolls...",
                        );
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
                client.logger.alert(
                    "Farm",
                    "Roll",
                    "Cannot retrieve Left Roll.",
                );
                return;
            }
            const rollsRegex = /You have \*\*(\d+)\*\* (rolls?|roll) left/;

            const resetTimeRegex = /Next rolls reset in \*\*(\d+)\*\* min/;

            const rollsMatch = message.content.match(rollsRegex);
            const rollsLeft = rollsMatch ? parseInt(rollsMatch[1], 10) : 0;

            const resetTimeMatch = message.content.match(resetTimeRegex);
            if (resetTimeMatch) {
                const minutes = parseInt(resetTimeMatch[1], 10);
                const milliseconds = minutes * 60 * 1000;
                resettime = milliseconds;
            }
            client.logger.info("Farm", "Roll", `${rollsLeft} roll up`);
            if (rollsLeft > 0) {
                await client.delay(2500);
                await roll(client, channel);
            } else if (client.global.temp.rollresetstock > 0) {
                await client.delay(2500);
                await reset(client, channel);
            } else {
                setTimeout(async () => {
                    await client.delay(2500);
                    await roll(client, channel);
                }, resettime);
            }
        });
}
