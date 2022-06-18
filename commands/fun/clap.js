const { replyMessage } = require("../../functions/general/replyMessage")

module.exports = {
    name: "clap",
    description: "Far scrivere al bot un qualsiasi messaggio con tantissimi clap in mezzo",
    permissionLevel: 0,
    requiredLevel: 30,
    cooldown: 15,
    syntax: "/clap [text]",
    category: "fun",
    data: {
        options: [
            {
                name: "text",
                description: "Messaggio da far scrivere al bot insieme ai clap",
                type: "STRING",
                required: true
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let text = interaction.options.getString("text")

        if (text.length > 500) {
            return replyMessage(client, interaction, "Warning", "Testo troppo lungo", "Puoi scrivere un messaggio solo fino a 1000 caratteri", comando)
        }

        let words = text.split(/\s+/)

        if (words.length <= 1) {
            return replyMessage(client, interaction, "Warning", "Scrivi più parole", "È necessario scrivere un messaggio con più parole divise da uno spazio", comando)
        }

        interaction.reply(words.join(" :clap: "))
    },
};