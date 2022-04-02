module.exports = {
    name: "youtube",
    aliases: ["yt"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Link ai canali YouTube di Giulio",
    syntax: "!youtube",
    category: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var embed = new Discord.MessageEmbed()
            .setTitle("GiulioAndCode")
            .setColor("#41A9F6")
            .setDescription("Questi sono i **canali** di Giulio\rIscriviti, lascia like, e attiva la campanellina")
            .addField(":computer: GiulioAndCode", `
[View channel](https://www.youtube.com/c/GiulioAndCode)
Video, tutorial, contenuti sulla programmazione, nello specifico nel mondo di Bot Discord`)
            .addField(":v: Giulio", `
[View channel](https://www.youtube.com/channel/UCvIafNR8ZvZyE5jVGVqgVfA)
Contenuti più personali e incentrati sull'intrattenimento`)

        message.channel.send({ embeds: [embed] })
            .catch(() => { })
    },
};