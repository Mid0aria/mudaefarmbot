/*
 * Mudae Farm Bot
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

module.exports = async (client) => {
    const load = (dirs) => {
        const events = client.fs
            .readdirSync(`./events/${dirs}/`)
            .filter((d) => d.endsWith(".js"));
        for (let file of events) {
            const evt = require(`../events/${dirs}/${file}`);
            let eName = file.split(".")[0];
            client.on(eName, evt.bind(null, client));
        }
    };

    client.fs.readdirSync("./events/").forEach((x) => load(x));
};
