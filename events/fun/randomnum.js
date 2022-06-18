const Discord = require("discord.js")
const { isMaintenance } = require("../../functions/general/isMaintenance");
const { replyMessage } = require("../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("randomnum")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let min = parseInt(interaction.customId.split(",")[2])
        let max = parseInt(interaction.customId.split(",")[3])

        let embed = new Discord.MessageEmbed()
            .setTitle(`Random number from ${min} to ${max}`)
            .setColor("#EA596E")
            .setDescription(`:game_die: Numero generato: **${Math.floor(Math.random() * (max - min + 1)) + min}**`)

        let button1 = new Discord.MessageButton()
            .setLabel("Rigenera")
            .setStyle("PRIMARY")
            .setCustomId(`randomnum,${interaction.user.id},${min},${max}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)

        interaction.message.edit({ embeds: [embed], components: [row] })
    },
};
