module.exports = async (client, channel, type = null) => {
    if (type === "reclaim") {
        setTimeout(async () => {
            await claim(client, channel);
        }, client.global.temp.dailykakeraagain);
    } else {
        if (client.config.dailykakera) await check(client, channel);
    }
};

async function check(client, channel) {
    if (client.global.paused) return;

    channel.sendTyping();
    await channel
        .send({
            content: `$dk`,
        })
        .then(async (clmsg) => {
            let id = clmsg.id;
            let message = await getMessage();
            async function getMessage() {
                return new Promise((resolve) => {
                    const filterphrases = [
                        "added to your kakera collection",
                        "$dk reset in",
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
                            "Daily Kakera",
                            "Rechecking Daily Kakera...",
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

            const dailykakeraagainregex =
                /$dk reset in \*\*(\d+)h\s(\d+)min\*\*/;
            const match = message.match(dailykakeraagainregex);

            if (match) {
                const hours = parseInt(match[1], 10);
                const minutes = parseInt(match[2], 10);

                const milliseconds =
                    hours * 60 * 60 * 1000 + minutes * 60 * 1000;
                client.global.temp.dailykakeraagain = milliseconds;
                client.logger.warn(
                    "Farm",
                    "Daily Kakera",
                    `Daily kakera claimed in advance. It will restart in ${client.global.temp.dailykakeraagain} milliseconds`,
                );
            } else if (
                message.content.toLowerCase.includes(
                    "added to your kakera collection",
                )
            ) {
                client.global.temp.dailykakeraagain =
                    client.global.temp.dailykakeraagain + 1500;

                client.logger.info(
                    "Farm",
                    "Daily Kakera",
                    `Daily Kakera Claimed, Will be claimed again after ${client.global.temp.dailykakeraagain} milliseconds`,
                );
            }
            setTimeout(async () => {
                await claim(client, channel);
            }, client.global.temp.dailykakeraagain);
        });
}

async function claim(client, channel) {
    if (client.global.paused) return;
    channel.sendTyping();
    await channel
        .send({
            content: `$dk`,
        })
        .then(async () => {
            client.logger.info("Farm", "Daily Kakera", `Daily Kakera Claimed`);
            await check(client, channel);
        });
}
