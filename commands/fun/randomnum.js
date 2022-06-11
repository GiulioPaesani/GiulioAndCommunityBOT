const Discord = require('discord.js');
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage")

module.exports = {
    name: "randomnum",
    description: "Estrai un numero random tra il minimo e il massimo inseriti",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/randomnum [min] [max]",
    category: "fun",
    client: "fun",
    data: {
        options: [
            {
                name: "min",
                description: "Numero minimo possibile da estrarre",
                type: "INTEGER",
                required: true,
            },
            {
                name: "max",
                description: "Numero massimo possibile da estrarre",
                type: "INTEGER",
                required: true
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let min = interaction.options.getInteger("min")
        let max = interaction.options.getInteger("max")

        if (max < min) {
            return replyMessage(client, interaction, "Warning", "Minimo e massimo non validi", "Il numero massimo non può essere più piccole del numero minimo", comando)
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Random number from ${min} to ${max}`)
            .setColor("#EA596E")
            .setDescription(`:game_die: Numero generato: **${Math.floor(Math.random() * (max - min + 1)) + min}**`)

        let button1 = new Discord.MessageButton()
            .setLabel("Rigenera")
            .setStyle("PRIMARY")
            .setCustomId(`randomnum,${interaction.user.id},${min},${max}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};