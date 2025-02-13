/*
 * Mudae Farm Bot
 * Copyright (C) 2024 Mido
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
 */

module.exports = {
    config: {
        name: "stats",
    },
    run: async (client, message) => {
        let totals = client.global.total;

        const seconds = Math.floor(process.uptime());
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const uptime = `${days}d ${hours}h ${minutes}m ${seconds % 60}s`;
        let stats = `
Mudae Farm Bot Statistics:
===================
- Roll: ${totals.roll}
- Vote: ${totals.vote}
===================
- Uptime: ${uptime}
        `;

        await message.delete();
        await message.channel.send("```" + stats + "```");
    },
};
