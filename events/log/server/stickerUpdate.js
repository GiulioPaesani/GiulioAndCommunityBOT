const Discord = require('discord.js');
const moment = require('moment');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: `stickerUpdate`,
    client: "general",
    async execute(client, oldSticker, newSticker) {
        if (isMaintenance()) return

        if (newSticker.guild.id != settings.idServer) return

        const fetchedLogs = await newSticker.guild.fetchAuditLogs({
            limit: 1,
            type: 'STICKER_UPDATE',
        });
        const logs = fetchedLogs.entries.first();

        let embed = new Discord.MessageEmbed()
            .setTitle(":pencil: Sticker updated :pencil:")
            .setColor(colors.yellow)
            .setThumbnail(newSticker.url)
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`, false)
            .addField(":label: Sticker", `${oldSticker.name} - [Image](${newSticker.url})`)

        logs.changes.forEach(change => {
            switch (change.key) {
                case "tags": change.old = !change.old ? "" : `:${change.old}:`; change.new = !change.new ? "" : `:${change.new}:`; break;
            }

            switch (change.key) {
                case "name": change.key = "Name"; break;
                case "description": change.key = "Description"; break;
                case "tags": change.key = "Tags"; break;
            }

            if (!change.old) change.old = "_Null_"
            if (!change.new) change.new = "_Null_"

            embed
                .addField(change.key, `
Old: ${change.old}
New: ${change.new}
`)
        })

        client.channels.cache.get(log.server.emojiSticker).send({ embeds: [embed] })
    },
};