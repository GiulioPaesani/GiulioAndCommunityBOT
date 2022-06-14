const Discord = require("discord.js")
const fetch = require("node-fetch")
const colors = require("../../../config/general/colors.json")

module.exports = {
    name: "eval",
    description: "Eseguire una stringa di codice",
    permissionLevel: 3,
    requiredLevel: 0,
    syntax: "/eval [text]",
    category: "general",
    client: "general",
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

        let funToken = await fetch("http://localhost:2000/client", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": String(process.env.apiKey)
            }
        }).catch(() => { })

        if (funToken) {
            funToken = await funToken.text()
            funToken = JSON.parse(funToken).token
        }

        let moderactionToken = await fetch("http://localhost:3000/client", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": String(process.env.apiKey)
            }
        }).catch(() => { })

        if (moderactionToken) {
            moderactionToken = await moderactionToken.text()
            moderactionToken = JSON.parse(moderactionToken).token
        }

        let rankingToken = await fetch("http://localhost:4000/client", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": String(process.env.apiKey)
            }
        }).catch(() => { })

        if (rankingToken) {
            rankingToken = await rankingToken.text()
            rankingToken = JSON.parse(rankingToken).token
        }

        text = text.replace(eval(`/${client.token}/g`), `#######TOKEN#######`)
        if (funToken) text = text.replace(eval(`/${funToken}/g`), `#######TOKEN#######`)
        if (moderactionToken) text = text.replace(eval(`/${moderactionToken}/g`), `#######TOKEN#######`)
        if (rankingToken) text = text.replace(eval(`/${rankingToken}/g`), `#######TOKEN#######`)
        // musicBots.forEach(bot => {
        //     text = text.replace(eval(`/${bot.client.token}/g`), `#######TOKEN#######`)
        // })

        try {
            let evaled = await eval(text)

            if (evaled) {
                evaled = evaled.toString()
                evaled = evaled.replace(eval(`/${client.token}/g`), `#######TOKEN#######`)
                if (funToken) evaled = evaled.replace(eval(`/${funToken}/g`), `#######TOKEN#######`)
                if (moderactionToken) evaled = evaled.replace(eval(`/${moderactionToken}/g`), `#######TOKEN#######`)
                if (rankingToken) evaled = evaled.replace(eval(`/${rankingToken}/g`), `#######TOKEN#######`)
                // musicBots.forEach(bot => {
                //     evaled = evaled.replace(eval(`/${bot.client.token}/g`), `#######TOKEN#######`)
                // })
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
            error = error.replace(eval(`/${clientFun.token}/g`), `#######TOKEN#######`)
            error = error.replace(eval(`/${clientModeration.token}/g`), `#######TOKEN#######`)
            error = error.replace(eval(`/${clientRanking.token}/g`), `#######TOKEN#######`)
            musicBots.forEach(bot => {
                error = error.replace(eval(`/${bot.client.token}/g`), `#######TOKEN#######`)
            })

            let embed = new Discord.MessageEmbed()
                .setColor(colors.red)
                .setTitle("Error with Eval")
                .addField(":inbox_tray: Input", text.slice(0, 1024))
                .addField(":name_badge: Error", error.slice(0, 1024))

            interaction.reply({ embeds: [embed] })
        }
    },
};