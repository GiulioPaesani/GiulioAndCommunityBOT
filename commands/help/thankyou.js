const Discord = require("discord.js")
const settings = require("../../config/general/settings.json");
const colors = require("../../config/general/colors.json")
const { getTaggedUser } = require("../../functions/general/getTaggedUser");
const { replyMessage } = require("../../functions/general/replyMessage")

module.exports = {
    name: "thankyou",
    description: "Ringraziare un utente dell'aiuto dato",
    permissionLevel: 0,
    cooldown: 30,
    requiredLevel: 0,
    syntax: "/thankyou [user] (message)",
    category: "help",
    data: {
        options: [
            {
                name: "user",
                description: "Utente da ringraziare",
                type: "STRING",
                required: true
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.help],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user"), true)

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (utente.id == interaction.user.id) {
            return replyMessage(client, interaction, "Warning", "Non da solo", "Non ti puoi ringraziare da solo", comando)
        }

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non un bot", "Non puoi ringraziare un bot", comando)
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Attesa accettazione")
            .setColor(colors.yellow)
            .setDescription(`${utente.toString()} premi su "Accetta ringraziamento" per ricevere il grazie dall'utente`)

        let button1 = new Discord.MessageButton()
            .setLabel("Annulla/Rifiuta ringraziamento")
            .setStyle("DANGER")
            .setCustomId(`annullaThank,${utente.id},${interaction.user.id}`)

        let button2 = new Discord.MessageButton()
            .setLabel("Accetta ringraziamento")
            .setStyle("SUCCESS")
            .setCustomId(`accettaThank,${utente.id},${interaction.user.id}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};