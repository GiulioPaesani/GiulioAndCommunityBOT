const Discord = require("discord.js")
const colors = require("../../config/general/colors.json");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { replyMessage } = require("../../functions/general/replyMessage")

module.exports = {
    name: "segnala",
    description: "Reportare un utente allo staff per un comportamento scorretto o contro le regole",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/segnala [user] [reason]",
    category: "general",
    data: {
        options: [
            {
                name: "user",
                description: "Utente da segnalare",
                type: "STRING",
                required: true
            },
            {
                name: "reason",
                description: "Ragione per cui segnalare l'utente",
                type: "STRING",
                required: true,
                autocomplete: true
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user"))

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (getUserPermissionLevel(client, utente.id) >= 1) {
            return replyMessage(client, interaction, "Warning", "Non un moderatore", "Non puoi segnalare un utente moderatore", comando)
        }

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non un bot", "Non puoi segnalare un bot", comando)
        }

        if (utente.id == interaction.user.id) {
            return replyMessage(client, interaction, "Warning", "Non da solo", "Non ti puoio segnalare da solo", comando)
        }

        let reason = interaction.options.getString("reason")
        if (reason.length > 1024) {
            return replyMessage(client, interaction, "Warning", "Reason troppo lunga", "Puoi scrivere una reason solo fino a 1024 caratteri", comando)
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Confermi la tua segnalazione?")
            .setColor(colors.yellow)
            .setDescription(`**Confermi** il tuo report? Una volta confermato verrà **inviato** allo staff che cercherà di **intervenire** il prima possibile\nSpiega in modo esaustivo e chiaro il motivo`)
            .addField(":bust_in_silhouette: User", `${utente.toString()} - ID: ${utente.id}`)
            .addField(":page_facing_up: Reason", reason)

        let button1 = new Discord.MessageButton()
            .setLabel("Annulla")
            .setStyle("DANGER")
            .setCustomId(`annullaSegnala,${interaction.user.id}`)

        let button2 = new Discord.MessageButton()
            .setLabel("Conferma")
            .setStyle("SUCCESS")
            .setCustomId(`confermaSegnala,${interaction.user.id}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};