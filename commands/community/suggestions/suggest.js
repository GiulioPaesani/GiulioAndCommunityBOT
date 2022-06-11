const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: "suggest",
    description: "Proporre un suggerimento riguardante il server, i canali, il bot, i video o altro",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/suggest [text]",
    category: "community",
    client: "general",
    data: {
        options: [
            {
                name: "text",
                description: "Testo del suggerimento",
                type: "STRING",
                required: true
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let text = interaction.options.getString("text")

        if (text.length > 1000) {
            return replyMessage(client, interaction, "Warning", "Testo troppo lungo", "Puoi scrivere un suggerimento solo fino a 1000 caratteri", comando)
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Confermi il tuo suggerimento?")
            .setColor(colors.yellow)
            .setDescription(`**Confermi** il tuo suggest? Una volta creato verrà **inviato** allo staff che dovrà accettarlo, e nel caso verrà pubblicato nel canale <#${settings.idCanaliServer.suggestions}>`)
            .addField(":page_facing_up: Text", text)

        let button1 = new Discord.MessageButton()
            .setLabel("Annulla")
            .setStyle("DANGER")
            .setCustomId(`annullaSuggestion,${interaction.user.id}`)

        let button2 = new Discord.MessageButton()
            .setLabel("Conferma")
            .setStyle("SUCCESS")
            .setCustomId(`confermaSuggestion,${interaction.user.id}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};