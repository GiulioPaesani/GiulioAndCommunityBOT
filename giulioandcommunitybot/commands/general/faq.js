const Discord = require("discord.js");
const settings = require("../../config/general/settings.json");
const colors = require("../../config/general/colors.json");
const { replyMessage } = require("../../functions/general/replyMessage");

module.exports = {
    name: "faq",
    description: "Postare una domande e risposta nel canale FAQ",
    permissionLevel: 2,
    requiredLevel: 0,
    cooldown: 10,
    syntax: "/faq [category] [domanda] [risposta]",
    category: "general",
    client: "general",
    data: {
        options: [
            {
                name: "category",
                description: "Categoria della domanda",
                type: "STRING",
                required: true,
                choices: [
                    {
                        name: "🤖 Discord development",
                        value: "discord"
                    },
                    {
                        name: "🌐 Web development",
                        value: "web"
                    }
                ]
            },
            {
                name: "domanda",
                description: "Testo della domanda",
                type: "STRING",
                required: true
            },
            {
                name: "risposta",
                description: "Testo della risposta",
                type: "STRING",
                required: true
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let category = interaction.options.getString("category")
        let domanda = interaction.options.getString("domanda")
        let risposta = interaction.options.getString("risposta")

        if (domanda.length > 256) {
            return replyMessage(client, interaction, "Warning", "Domanda troppo lunga", "Puoi scrivere una domanda solo fino a 256 caratteri", comando)
        }

        if (domanda.length > 1024) {
            return replyMessage(client, interaction, "Warning", "Risposta troppo lunga", "Puoi scrivere una risposta solo fino a 1024 caratteri", comando)
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Confermi la FAQ?")
            .setColor(colors.yellow)
            .setDescription(`**Confermi** la domanda? Una volta creata verrà **inviato** nel canale <#${settings.idCanaliServer.faq}>`)
            .addField(domanda, risposta)

        let button1 = new Discord.MessageButton()
            .setLabel("Annulla")
            .setStyle("DANGER")
            .setCustomId(`annullaFaq,${interaction.user.id}`)

        let button2 = new Discord.MessageButton()
            .setLabel("Conferma")
            .setStyle("SUCCESS")
            .setCustomId(`confermaFaq,${interaction.user.id},${category}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};