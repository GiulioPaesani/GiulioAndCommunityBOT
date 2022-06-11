const Discord = require("discord.js")
const moment = require("moment")
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("settaNick")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let nickname = interaction.customId.slice(29)

        if (!interaction.member.nickname) {
            let embed = new Discord.MessageEmbed()
                .setTitle(":inbox_tray: Nickname setted :inbox_tray:")
                .setColor(colors.green)
                .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`, false)
                .addField(":placard: Nickname", `Old: _Null_\nNew: ${nickname}`)

            if (!isMaintenance())
                client.channels.cache.get(log.server.membersPresence).send({ embeds: [embed] })
        }
        else {
            let embed = new Discord.MessageEmbed()
                .setTitle(":pencil: Nickname updated :pencil:")
                .setColor(colors.yellow)
                .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`, false)
                .addField(":placard: Nickname", `Old: ${interaction.member.nickname}\nNew: ${nickname}`)

            if (!isMaintenance())
                client.channels.cache.get(log.server.membersPresence).send({ embeds: [embed] })
        }

        await interaction.member.setNickname(nickname)

        let embed = new Discord.MessageEmbed()
            .setTitle("Nickname settato")
            .setColor(colors.blue)
            .setDescription(`Hai settato il tuo nickname in **${interaction.member.nickname}**`)

        interaction.message.edit({ embeds: [embed], components: [] })
    },
};
