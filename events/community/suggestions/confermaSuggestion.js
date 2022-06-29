const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const log = require("../../../config/general/log.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("confermaSuggestion")) return

        await interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let embed = new Discord.MessageEmbed()
            .setTitle("💡 SUGGERIMENTO inviato 💡")
            .setColor(colors.green)
            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
            .setDescription("Grazie per aver fatto un suggerimento. Attendi che lo staff approvi il tuo suggest")
            .addField(":page_facing_up: Text", interaction.message.embeds[0].fields[0].value)

        interaction.message.edit({ embeds: [embed], components: [] })

        embed = new Discord.MessageEmbed()
            .setTitle("💡 New suggestion 💡")
            .setColor(colors.yellow)
            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
            .addField(":bust_in_silhouette: User", `${interaction.user.username} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
            .addField(":label: Status", "Pending")
            .addField(":page_facing_up: Text", interaction.message.embeds[0].fields[0].value)

        let button1 = new Discord.MessageButton()
            .setStyle('DANGER')
            .setLabel('Rifiuta')
            .setCustomId(`rifiutaSuggestion`)

        let button2 = new Discord.MessageButton()
            .setStyle('SUCCESS')
            .setLabel('Approva')
            .setCustomId(`approvaSuggestion`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        let select = new Discord.MessageSelectMenu()
            .setCustomId(`rifiutiComuniSuggestion`)
            .setPlaceholder('Rifiuti comuni')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions({
                label: "Suggerimento già presente o già proposto in precedenza",
                value: "Suggerimento già presente o già proposto in precedenza",
            })
            .addOptions({
                label: "Non ha senso essere votato, lo faccio subito",
                value: "Non ha senso essere votato, lo faccio subito",
            })
            .addOptions({
                label: "Che cosa vuol dire? Non si capisce! Rifai il suggerimento cerca di spiegare meglio grazie",
                value: "Che cosa vuol dire? Non si capisce! Rifai il suggerimento cerca di spiegare meglio grazie",
            })

        let row2 = new Discord.MessageActionRow()
            .addComponents(select)

        client.channels.cache.get(log.community.suggestions).send({ embeds: [embed], components: [row2, row] })
    },
};
