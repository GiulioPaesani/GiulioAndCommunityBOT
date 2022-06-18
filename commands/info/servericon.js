const Discord = require("discord.js")
const settings = require("../../config/general/settings.json");

module.exports = {
    name: "servericon",
    description: "Visuallizzare l'icona del server",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/servericon",
    category: "info",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Server avatar")
            .setDescription(`L'icona del server`)
            .setImage(interaction.guild.iconURL({ dynamic: true }))

        interaction.reply({ embeds: [embed] })
    },
};