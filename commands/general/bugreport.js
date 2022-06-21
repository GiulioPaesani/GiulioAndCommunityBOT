const Discord = require("discord.js")
const colors = require("../../config/general/colors.json")
const { replyMessage } = require("../../functions/general/replyMessage")

module.exports = {
    name: "bugreport",
    description: "Segnalare un problema riguardante il server, il bot, canali o altro",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/bugreport [text]",
    category: "general",
    data: {
        options: [
            {
                name: "text",
                description: "Testo del report",
                type: "STRING",
                required: true
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let text = interaction.options.getString("text")

        if (text.length > 1000) {
            return replyMessage(client, interaction, "Warning", "Testo troppo lungo", "Puoi scrivere un messaggio solo fino a 1000 caratteri", comando)
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Confermi il tuo report?")
            .setColor(colors.yellow)
            .setDescription(`**Confermi** il tuo bug report? Una volta accettato verrà **inviato** allo staff che cercherà di **risolvere** il problema il prima possibile\nSpiega in modo esaustivo e chiaro il problema`)
            .addField(":page_facing_up: Text", text)

        let button1 = new Discord.MessageButton()
            .setLabel("Annulla")
            .setStyle("DANGER")
            .setCustomId(`annullaReport,${interaction.user.id}`)

        let button2 = new Discord.MessageButton()
            .setLabel("Conferma")
            .setStyle("SUCCESS")
            .setCustomId(`confermaReport,${interaction.user.id}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};