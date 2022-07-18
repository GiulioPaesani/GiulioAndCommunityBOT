const Discord = require("discord.js")
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("confermaProgetto")) return

        await interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let embed = new Discord.MessageEmbed()
            .setTitle(":newspaper: Progetto inviato :newspaper:")
            .setColor(colors.green)
            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
            .setDescription(`Grazie per aver pubblico un tuo progetto. Attendi che lo staff approvi il tuo post`)
            .addField(interaction.message.embeds[0].fields[0].name, interaction.message.embeds[0].fields[0].value)

        interaction.message.edit({ embeds: [embed], components: [] })

        embed = new Discord.MessageEmbed()
            .setTitle(":newspaper: New project :newspaper: ")
            .setColor(colors.yellow)
            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
            .addField(":bust_in_silhouette: User", `${interaction.user.username} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
            .addField(":label: Status", "Pending")
            .addField(":placard: Title", interaction.message.embeds[0].fields[0].name)
            .addField(":page_facing_up: Description", interaction.message.embeds[0].fields[0].value)
            .addField(":frame_photo: Image", interaction.message.embeds[0].image?.url ? `[Image](${interaction.message.embeds[0].image.url})` : "_Null_", true)
            .addField(":brown_circle: Button1", interaction.message.components.length == 1 ? "_Null_" : `[${interaction.message.components[0].components[0].label}](${interaction.message.components[0].components[0].url})`, true)
            .addField(":purple_circle: Button2", interaction.message.components.length == 1 || !interaction.message.components[0].components[1] ? "_Null_" : `[${interaction.message.components[0].components[1].label}](${interaction.message.components[0].components[1].url})`, true)

        let button1 = new Discord.MessageButton()
            .setStyle('DANGER')
            .setLabel('Rifiuta')
            .setCustomId(`rifiutaProgetto`)

        let button2 = new Discord.MessageButton()
            .setStyle('SUCCESS')
            .setLabel('Approva')
            .setCustomId(`approvaProgetto`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        let select = new Discord.MessageSelectMenu()
            .setCustomId(`rifiutiComuniProgetti`)
            .setPlaceholder('Rifiuti comuni')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions({
                label: "Progetto non troppo interessante da essere pubblicato",
                value: "Progetto non troppo interessante da essere pubblicato",
            })
            .addOptions({
                value: "Spiega e racconta meglio il tuo progetto, non capisce bene. Rifai il post e magari verrai accetato",
                label: "Spiega e racconta meglio il tuo progetto, non capisce bene. Rifai il post e magari verrai accetato",
            })
            .addOptions({
                label: "Progetto già presente",
                value: "Progetto già presente",
            })

        let row2 = new Discord.MessageActionRow()
            .addComponents(select)

        client.channels.cache.get(log.community.projects).send({ embeds: [embed], components: [row2, row] })
    },
};
