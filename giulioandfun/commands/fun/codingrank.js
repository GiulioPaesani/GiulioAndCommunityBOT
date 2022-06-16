const Discord = require("discord.js");
const settings = require("../../config/general/settings.json");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");
module.exports = {
    name: "codingrank",
    description: "Scropri quanto è bravo a programmare un utente",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 5,
    syntax: "/codingrank (user)",
    category: "fun",
    client: "fun",
    data: {
        options: [
            {
                name: "user",
                description: "Utente di cui vedere il livello di programmazione",
                type: "STRING",
                required: false
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user")) || interaction.user

        let embed = new Discord.MessageEmbed()
            .setTitle("Coding rank machine")
            .setColor("#5DADEC")
            .setDescription(`:computer: ${utente.toString()} ha un livello di programmazione al **${(Math.random() * 100).toFixed(2)}%**`)

        interaction.reply({ embeds: [embed] })
    },
};