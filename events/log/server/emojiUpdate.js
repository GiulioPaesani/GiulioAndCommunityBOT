const Discord = require('discord.js');
const moment = require('moment');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: `emojiUpdate`,
    client: "general",
    async execute(client, oldEmoji, newEmoji) {
        if (isMaintenance()) return

        if (newEmoji.guild.id != settings.idServer) return

        const fetchedLogs = await newEmoji.guild.fetchAuditLogs({
            limit: 1,
            type: 'EMOJI_UPDATE',
        });
        const logs = fetchedLogs.entries.first();

        let embed = new Discord.MessageEmbed()
            .setTitle(":pencil: Emoji updated :pencil:")
            .setColor(colors.yellow)
            .setThumbnail(emoji.url)
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`, false)
            .addField(":smiley: Emoji", `<${newEmoji.animated ? "a" : ""}:${oldEmoji.name}:${newEmoji.id}> - [Image](https://cdn.discordapp.com/emojis/${newEmoji.id}.webp?size=512)`)

        logs.changes.forEach(change => {
            switch (change.key) {
                case "name": change.key = "Name"; break;
            }

            if (!change.old) change.old = "_Null_"
            if (!change.new) change.new = "_Null_"

            embed
                .addField(change.key, `
Old: ${change.old}
New: ${change.new}
`)
        })

        // client.channels.cache.get(log.server.emojiSticker).send({ embeds: [embed] })
    },
};