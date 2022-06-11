const Discord = require("discord.js");
const settings = require("../../../config/general/settings.json");
const colors = require("../../../config/general/colors.json");

module.exports = {
    name: "question",
    description: "Fare una domanda a Giulio a cui risponderà in un video",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/question [domanda]",
    category: "community",
    client: "general",
    data: {
        options: [
            {
                name: "domanda",
                description: "Testo della domanda",
                type: "STRING",
                required: true
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let domanda = interaction.options.getString("domanda")

        if (domanda.length > 256) {
            return replyMessage(client, interaction, "Warning", "Domanda troppo lunga", "Puoi scrivere una domanda solo fino a 256 caratteri", comando)
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Confermi la tua DOMANDA?")
            .setColor(colors.yellow)
            .setDescription(`**Confermi** la tua domanda? Una volta creata verrà **inviata** allo staff che dovrà accettarla, e nel caso verrà pubblicata nel canale <#${settings.idCanaliServer.qna}> per poi essere risposta da Giulio`)
            .addField(":page_facing_up: Text", domanda)

        let button1 = new Discord.MessageButton()
            .setLabel("Annulla")
            .setStyle("DANGER")
            .setCustomId(`annullaDomanda,${interaction.user.id}`)

        let button2 = new Discord.MessageButton()
            .setLabel("Conferma")
            .setStyle("SUCCESS")
            .setCustomId(`confermaDomanda,${interaction.user.id}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};