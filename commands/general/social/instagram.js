module.exports = {
    name: "instagram",
    aliases: ["insta", "ig"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Link al profilo Instagram di Giulio",
    syntax: "!instagram",
    category: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var embed = new Discord.MessageEmbed()
            .setTitle("<:instagram:927640217320579152> Instagram <:instagram:927640217320579152>")
            .setColor("#E7476B")
            .setDescription("Ecco il profilo Instagram di **Giulio**\r:link: [giulio_paesani](https://www.instagram.com/giulio_paesani/)")

        message.channel.send({ embeds: [embed] })
            .catch(() => { })
    },
};