const Discord = require('discord.js');
const moment = require('moment');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: `stickerCreate`,
    client: "general",
    async execute(client, sticker) {
        if (isMaintenance()) return

        if (sticker.guild.id != settings.idServer) return

        const fetchedLogs = await sticker.guild.fetchAuditLogs({
            limit: 1,
            type: 'STICKER_CREATE',
        });
        const logs = fetchedLogs.entries.first();

        let embed = new Discord.MessageEmbed()
            .setTitle(":mouse_three_button: Sticker created :mouse_three_button:")
            .setColor(colors.green)
            .setThumbnail(sticker.url)
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\rID: ${logs.executor.id}`, false)
            .addField(":label: Sticker", `${sticker.name} - [Image](${sticker.url})`)
            .addField(":page_with_curl: Description", sticker.description || "_Null_")
            .addField(":receipt: ID", sticker.id)
            .addField(":clipboard: Tag", `:${sticker.tags[0]}:`)

        client.channels.cache.get(log.server.emojiSticker).send({ embeds: [embed] })
    },
};