const Discord = require('discord.js');
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage")

module.exports = {
    name: "8ball",
    description: "Fai una domanda e il destino saprà risponderti",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 5,
    syntax: "/8ball",
    category: "fun",
    data: {
        options: [
            {
                name: "question",
                description: "Domanda che vuoi fare",
                type: "STRING",
                required: true
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let question = interaction.options.getString("question")

        if (question.length > 256) {
            return replyMessage(client, interaction, "Warning", "Domanda troppo lunga", "Puoi scrivere una domanda solo fino a 256 caratteri", comando)
        }

        const answers = [
            "È decisamente così",
            "Senza dubbio",
            "Molto probabilmente",
            "Sì",
            "I segni indicano sì",
            "La domanda è confusa, riprova",
            "Chiedi più tardi",
            "Meglio non dirtelo ora",
            "Non lo posso prevedere adesso",
            "Concentrati e chiedelo di nuovo",
            "Non contarci",
            "La mia risposta è no",
            "Le mie fonti dicono di no",
            "La prospettiva non è buona",
            "Sono molto dubbioso"
        ]

        let embed = new Discord.MessageEmbed()
            .setTitle(question)
            .setColor("#AA8DD8")
            .setDescription(`:crystal_ball: La risposta del destino: **${answers[Math.floor(Math.random() * answers.length)]}**`)

        interaction.reply({ embeds: [embed] })
    },
};