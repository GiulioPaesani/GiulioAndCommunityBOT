module.exports = {
    name: "tiktok",
    aliases: [],
    onlyStaff: false,
    availableOnDM: true,
    description: "Link al profilo TikTok di Giulio",
    syntax: "!tiktok",
    category: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var embed = new Discord.MessageEmbed()
            .setTitle("<:tiktok:927640216813068428> TikTok <:tiktok:927640216813068428>")
            .setColor("#F00044")
            .setDescription("Ecco il profilo TikTok di **Giulio**\r:link: [giulio.paesani](https://www.tiktok.com/@giulio.paesani)")

        message.channel.send({ embeds: [embed] })
            .catch(() => { })
    },
};