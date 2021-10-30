module.exports = {
    name: "bugreport",
    aliases: ["bug", "report"],
    onlyStaff: false,
    channelsGranted: [],
    async execute(message, args, client) {
        let report = args.join(" ");

        if (!report && !(message.attachments).array()[0]) {
            error(message, "Inserire un report", "`!bug [report]`")
            return
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(":beetle: Bug reportato :beetle:")
            .setColor("#1f1f1f")
            .setFooter("Lo staff lo analizzerà a breve")

        if (report)
            embed.setDescription("```" + report + "```")

        if ((message.attachments).array()[0])
            embed.setImage((message.attachments).array()[0].url)

        message.channel.send(embed)

        var embed = new Discord.MessageEmbed()
            .setTitle(":beetle: Bug report :beetle:")
            .setColor("#6DA54C")
            .addField(":bust_in_silhouette: User", "```" + `${message.author.username} (ID: ${message.author.id})` + "```", false)
            .addField(":page_facing_up: Channel", "```" + message.channel.name + "```[Message](https://discord.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + message.id + ")", true)
            .addField(":alarm_clock: Time", "```" + moment(new Date().getTime()).format("ddd DD MMM, HH:mm") + "```", true)

        if (report)
            embed.addField(":skull_crossbones: Bug", "```" + report + "```", false)

        if ((message.attachments).array()[0])
            embed.setImage((message.attachments).array()[0].url)

        client.channels.cache.get(log.bugReport).send(embed);
    },
};