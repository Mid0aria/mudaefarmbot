module.exports = async (client, channel, type = null) => {
    if (type === "reclaim") {
        setTimeout(async () => {
            await claim(client, channel);
        }, client.global.temp.dailyagain);
    } else {
        if (client.config.daily) await check(client, channel);
    }
};

async function check(client, channel) {
    if (client.global.paused) return;
    let id;
    channel.sendTyping();
    await channel
        .send({
            content: `$daily`,
        })
        .then(async (clmsg) => {
            id = clmsg.id;
            let message = await getMessage();
            async function getMessage() {
                return new Promise((resolve) => {
                    const filterphrases = [
                        "$daily reset in",
                        "likelist is empty",
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
                        client.logger.warn(
                            "Farm",
                            "Daily",
                            "Rechecking Daily...",
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

            const dailyagainregex =
                /\$daily\s+reset\s+in\s+\*\*(\d+)\s*h\s*(\d+)\*\*\s*min|\$daily\s+reset\s+in\s+\*\*(\d+)\*\*\s*min/;
            const match = message.content.match(dailyagainregex);

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
            } else if (
                message.content.toLowerCase().includes("likelist is empty")
            ) {
                client.logger.alert(
                    "Farm",
                    "Daily",
                    `Your Character likelist is empty!`,
                );
                return;
            }
            setTimeout(async () => {
                await client.delay(2500);
                await claim(client, channel);
            }, client.global.temp.dailyagain);
        });
}

async function claim(client, channel) {
    if (client.global.paused) return;
    channel.sendTyping();
    await channel
        .send({
            content: `$daily`,
        })
        .then(async () => {
            client.logger.info("Farm", "Daily", `Daily Claimed`);
            client.global.temp.rollresetstock++;
            await check(client, channel);
        });
}
