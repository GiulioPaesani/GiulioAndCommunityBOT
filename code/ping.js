module.exports = {
    name: "Ping",
    aliases: ["test"],
    description: "Ottenere il ping del bot",
    id: "1640886755",
    link: "https://www.toptal.com/developers/hastebin/qihucucivu.js",
    category: "utility",
    info: "",
    video: "",
    code: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        let embed = new Discord.EmbedBuilder()
            .setTitle("Ping del bot")
            .setDescription("Ecco la latenza del bot")
            .addField("Ping", \`\${client.ws.ping}ms\`)

        message.channel.send({embeds: [embed]})
    }
})`
};
