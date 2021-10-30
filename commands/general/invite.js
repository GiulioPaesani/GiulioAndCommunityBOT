module.exports = {
    name: "invite",
    aliases: [],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands],
    async execute(message, args, client) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Invito del server")
            .setDescription(":man_tipping_hand: Ecco a te l'invito da poter condividere con chiunque tu voglia per entrare nel server\r\rhttps://discord.gg/bTF589dQd6")
            .setColor("#677BC4");

        message.channel.send(embed)
    },
};