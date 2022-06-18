const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")

module.exports = {
    name: "eval",
    description: "Eseguire una stringa di codice",
    permissionLevel: 3,
    requiredLevel: 0,
    syntax: "/eval [text]",
    category: "general",
    data: {
        options: [
            {
                name: "text",
                description: "Stringa da eseguire",
                type: "STRING",
                required: true,
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let text = interaction.options.getString("text")

        text = text.replace(eval(`/${client.token}/g`), `#######TOKEN#######`)

        try {
            let evaled = await eval(text)

            if (evaled) {
                evaled = evaled.toString()
                evaled = evaled.replace(eval(`/${client.token}/g`), `#######TOKEN#######`)
            }

            let embed = new Discord.MessageEmbed()
                .setColor(colors.purple)
                .setTitle("Eval")
                .addField(":inbox_tray: Input", text.slice(0, 1024))
                .addField(":outbox_tray: Output", !evaled ? "Null" : evaled.slice(0, 1024))

            interaction.reply({ embeds: [embed] })
        }
        catch (error) {
            error = error.stack || error
            error = error.replace(eval(`/${client.token}/g`), `#######TOKEN#######`)

            let embed = new Discord.MessageEmbed()
                .setColor(colors.red)
                .setTitle("Error with Eval")
                .addField(":inbox_tray: Input", text.slice(0, 1024))
                .addField(":name_badge: Error", error.slice(0, 1024))

            interaction.reply({ embeds: [embed] })
        }
    },
};