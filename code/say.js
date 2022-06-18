module.exports = {
    name: "Say",
    aliases: [],
    description: "Far **scrivere** al bot un qualunque messaggio ",
    category: "commands",
    id: "1739466215",
    link: "https://www.toptal.com/developers/hastebin/yafosicixo.js",
    info: "",
    video: "",
    code: `
client.on("messageCreate", message => {
    if (message.content.startsWith("!say")) {
        const args = message.content.split(/\\s+/);
        let testo;
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
        let embed = new Discord.MessageEmbed()
            .setTitle(\`Say - \${message.author.username}\`)
            .setDescription(testo)

        message.channel.send({embeds: [embed]})
    }
})`
};
