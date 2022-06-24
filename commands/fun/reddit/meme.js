const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const fetch = require("node-fetch");

module.exports = {
    name: "meme",
    description: "Ottenere un meme random",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 5,
    syntax: "/meme",
    category: "fun",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let url = await fetch("https://www.reddit.com/r/memes/random/.json");
        let random = await url.json();

        let embed = new Discord.MessageEmbed()
            .setTitle(random[0].data.children[0].data.title)
            .setImage(random[0].data.children[0].data.url)
            .setFooter({ text: `From ${random[0].data.children[0].data.subreddit_name_prefixed}` })

        let button1 = new Discord.MessageButton()
            .setLabel("Go to post")
            .setStyle("LINK")
            .setURL(`https://www.reddit.com${random[0].data.children[0].data.permalink}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};