module.exports = {
    name: "bugreport",
    aliases: ["bug", "report"],
    onlyStaff: false,
    availableOnDM: false,
    description: "Segnalare un problema sul server, bot o canale",
    syntax: "!bugreport [report]",
    category: "general",
    channelsGranted: [],
    async execute(message, args, client, property) {
        var report = args.join(" ");

        if (!report && !Array.from(message.attachments)[0]) {
            return botCommandMessage(message, "Error", "Inserire un report", "Scrivi il testo del tuo report", property)
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(":beetle: Bug reportato :beetle:")
            .setColor("#77B256")
            .setDescription(`**Grazie** per aver segnalato questo problema. È già stato **consegnato** allo staff che lo **risolverà** a breve`)
            .addField(":page_facing_up: Text", report ? report : "None")

        var attachments = "";
        message.attachments.forEach(attachment => {
            console.log(attachment)
            attachments += `[File link](${attachment.url}), `
        })
        if (attachments)
            attachments = attachments.slice(0, -2);

        embed
            .addField(":paperclip: Attachments", attachments ? attachments : "None")

        message.channel.send({ embeds: [embed] })

        var embed = new Discord.MessageEmbed()
            .setTitle(":beetle: Bug report :beetle:")
            .setColor("#6DA54C")
            .addField(":alarm_clock: Time", moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss"), true)
            .addField(":bust_in_silhouette: User", `${message.author.toString()} (ID: ${message.author.id})`, false)
            .addField("Text", report ? report : "None")
            .addField("Attachments", attachments ? attachments : "None")

        if (!isMaintenance())
            client.channels.cache.get(log.general.bugReport).send({ embeds: [embed] });
    },
};