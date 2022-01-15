module.exports = {
    name: "Say",
    aliases: [],
    description: "Far **scrivere** al bot un qualunque messaggio ",
    category: "commands",
    id: "1739466215",
    info: "",
    video: "",
    v12: `
client.on("message", message => {
    if (message.content.startsWith("!say")) {
        var args = message.content.split(/\\s+/);
        var testo;
        testo = args.slice(1).join(" ");
        if (!testo) {
            return message.channel.send("Inserire un messaggio");
        }
        if (message.content.includes("@everyone") || message.content.includes("@here")) {
            return message.channel.send("Non taggare everyone o here");
        }
        message.delete()

        //Messaggio classico
        message.channel.send(testo)

        //Embed
        var embed = new Discord.MessageEmbed()
            .setTitle("Say")
            .setDescription(testo)

        message.channel.send(embed)
    }
})`,
    v13: `
client.on("messageCreate", message => {
    if (message.content.startsWith("!say")) {
        var args = message.content.split(/\\s+/);
        var testo;
        testo = args.slice(1).join(" ");
        if (!testo) {
            return message.channel.send("Inserire un messaggio");
        }
        if (message.content.includes("@everyone") || message.content.includes("@here")) {
            return message.channel.send("Non taggare everyone o here");
        }
        message.delete()

        //Messaggio classico
        message.channel.send(testo)

        //Embed
        var embed = new Discord.MessageEmbed()
            .setTitle("Say")
            .setDescription(testo)

        message.channel.send({embeds: [embed]})
    }
})`
};
