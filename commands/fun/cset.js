const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const { replyMessage } = require("../../functions/general/replyMessage")
const { getServer } = require("../../functions/database/getServer")
const { updateServer } = require("../../functions/database/updateServer")

module.exports = {
    name: "cset",
    description: "Settare il numero di counting corrente",
    permissionLevel: 2,
    requiredLevel: 0,
    syntax: "/cset [number]",
    category: "fun",
    data: {
        options: [
            {
                name: "number",
                description: "Numero da settare come corrente",
                type: "INTEGER",
                required: true,
                minValue: 0
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let count = interaction.options.getInteger("number")

        let serverstats = getServer()

        if (count > serverstats.counting.bestScore) {
            return replyMessage(client, interaction, "Error", "Numero troppo alto", "Non puoi ripristinare un numero maggiore del record del server", comando)
        }

        let oldNumber = serverstats.counting.number
        serverstats.counting.number = count;
        serverstats.counting.user = null

        updateServer(serverstats)

        let embed = new Discord.MessageEmbed()
            .setTitle("Numero corrente cambiato")
            .setColor(colors.blue)
            .setDescription(`Numero corrente cambiato in **${count}**, ora si può continuare a contare`)

        interaction.reply({ embeds: [embed] })

        if (interaction.channelId != settings.idCanaliServer.counting)
            client.channels.cache.get(settings.idCanaliServer.counting).send({ embeds: [embed] })

        client.channels.cache.get(settings.idCanaliServer.counting).send(count.toString())
            .then(msg => {
                msg.react("🟢")
            })
    },
};