const Discord = require("discord.js");

module.exports = {
    name: "invite",
    aliases: [],
    onlyStaff: false,
    channelsGranted: ["869975190052929566"],
    execute(message, args, client) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Invito del server")
            .setDescription(":man_tipping_hand: Ecco a te l'invito da poter condividere con chiunque tu voglia per entrare nel server\r\rhttps://discord.gg/38bqm5UvUB")
            .setColor("#677BC4");

        message.channel.send(embed)
    },
};