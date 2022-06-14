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

        await interaction.member.setNickname(nickname)

        let embed = new Discord.MessageEmbed()
            .setTitle("Nickname settato")
            .setColor(colors.blue)
            .setDescription(`Hai settato il tuo nickname in **${interaction.member.nickname}**`)

        interaction.message.edit({ embeds: [embed], components: [] })
    },
};
