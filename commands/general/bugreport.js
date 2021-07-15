const Discord = require("discord.js");
const moment = require("moment")

module.exports = {
    name: "bugreport",
    aliases: ["bug", "report"],
    onlyStaff: false,
    channelsGranted: [],
    execute(message, args, client) {
        let report = args.join(" ");

        if (!report && !(message.attachments).array()[0]) {
            error(message, "Inserire un report", "`!bug [report]`")
            return
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Bug reportato")
            .setColor("#1f1f1f")
            .addField(":bust_in_silhouette: User", "```" + message.member.user.tag + "```", true)
            .addField(":page_facing_up: Channel", "```" + message.channel.name + "```", true)
            .addField(":alarm_clock: Time", "```" + moment(new Date().getTime()).format("ddd DD MMM, HH:mm") + "```", false)

        if (report)
            embed.addField(":beetle: Bug", "```" + report + "```", false)


        if ((message.attachments).array()[0])
            embed.setImage((message.attachments).array()[0].url)

        message.channel.send(embed)

        if (message.channel.id == config.idCanaliServer.admin) return

        let canale = client.channels.cache.get(config.idCanaliServer.admin);
        canale.send(embed);
    },
};