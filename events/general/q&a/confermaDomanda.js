const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const log = require("../../../config/general/log.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("confermaDomanda")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let embed = new Discord.MessageEmbed()
            .setTitle(":love_letter: DOMANDA inviata :love_letter:")
            .setColor(colors.green)
            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
            .setDescription("Grazie per aver fatta questa domanda. Attendi che lo staff la approvi")
            .addField(":page_facing_up: Text", interaction.message.embeds[0].fields[0].value)

        interaction.message.edit({ embeds: [embed], components: [] })

        embed = new Discord.MessageEmbed()
            .setTitle(":love_letter: New question :love_letter:")
            .setColor(colors.yellow)
            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
            .addField(":bust_in_silhouette: User", `${interaction.user.username} - ID: ${interaction.user.id}`)
            .addField(":label: Status", "Pending")
            .addField(":page_facing_up: Text", interaction.message.embeds[0].fields[0].value)

        let button1 = new Discord.MessageButton()
            .setStyle('DANGER')
            .setLabel('Rifiuta')
            .setCustomId(`rifiutaDomanda`)

        let button2 = new Discord.MessageButton()
            .setStyle('SUCCESS')
            .setLabel('Approva')
            .setCustomId(`approvaDomanda`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        let select = new Discord.MessageSelectMenu()
            .setCustomId(`rifiutiComuniDomande`)
            .setPlaceholder('Rifiuti comuni')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions({
                label: "Domanda già presente",
                value: "Domanda già presente",
            })
            .addOptions({
                label: "Domanda troppo personale o intima, preferisco non rispondere",
                value: "Domanda troppo personale o intima, preferisco non rispondere",
            })
            .addOptions({
                label: "Domanda troppo vaga o generica. Rifai il comando cercando di essere più specifico",
                value: "Domanda troppo vaga o generica. Rifai il comando cercando di essere più specifico",
            })
            .addOptions({
                label: "Ci sarebbe tanto da dire, magari potrebbe uscirci un video a parte",
                value: "Ci sarebbe tanto da dire, magari potrebbe uscirci un video a parte",
            })

        let row2 = new Discord.MessageActionRow()
            .addComponents(select)

        client.channels.cache.get(log.community.qna).send({ embeds: [embed], components: [row2, row] })
    },
};
