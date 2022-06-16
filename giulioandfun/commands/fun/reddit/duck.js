const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const fetch = require("node-fetch");

module.exports = {
    name: "duck",
    description: "Ottenere un immagine di una paperella random",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 5,
    syntax: "/duck",
    category: "fun",
    client: "fun",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let url = await fetch("https://random-d.uk/api/v2/random?tag=duck");
        let random = await url.json();

        let embed = new Discord.MessageEmbed()
            .setTitle("Duck :duck:")
            .setImage(random.url)
            .setFooter({ text: `From random-d.uk` })

        interaction.reply({ embeds: [embed] })
    },
};