module.exports = {
    name: "invite",
    aliases: ["invito"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Link di invito del server",
    syntax: "!invite",
    category: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var embed = new Discord.MessageEmbed()
            .setTitle(":woman_raising_hand: Invito del server :man_raising_hand:")
            .setDescription(`Ecco a te l'invito da poter **condividere** con amici o chiunque tu voglia per **entrare** nel server
https://discord.gg/ypTCaveew2`)
            .setColor("#677BC4");

        message.channel.send({ embeds: [embed] })
            .catch(() => { })
    },
};