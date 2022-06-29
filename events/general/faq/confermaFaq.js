const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const illustrations = require("../../../config/general/illustrations.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("confermaFaq")) return

        await interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let embed = new Discord.MessageEmbed()
            .setTitle(":question: FAQ creata :question:")
            .setColor(colors.green)
            .setDescription(`Domanda creata e pubblicata in <#${settings.idCanaliServer.faq}>`)
            .addField(interaction.message.embeds[0].fields[0].name, interaction.message.embeds[0].fields[0].value)

        interaction.message.edit({ embeds: [embed], components: [] })

        embed = new Discord.MessageEmbed()
            .setAuthor({ name: interaction.customId.split(",")[2] == "web" ? "Web development" : interaction.customId.split(",")[2] == "discord" ? "Discord development" : "Other", iconURL: interaction.customId.split(",")[2] == "web" ? illustrations.html2 : interaction.customId.split(",")[2] == "discord" ? illustrations.discord : illustrations.other })
            .setTitle(interaction.message.embeds[0].fields[0].name)
            .setColor(interaction.customId.split(",")[2] == "web" ? "#E44F26" : interaction.customId.split(",")[2] == "discord" ? "#5865F2" : "#ABABAB")
            .setDescription(interaction.message.embeds[0].fields[0].value)

        client.channels.cache.get(settings.idCanaliServer.faq).send({ embeds: [embed] })
    },
};
