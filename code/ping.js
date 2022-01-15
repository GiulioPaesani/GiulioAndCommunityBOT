module.exports = {
    name: "Ping",
    aliases: ["test"],
    description: "Ottenere il ping del bot",
    id: "1640886755",
    category: "utility",
    info: "",
    video: "",
    v12: `
client.on("message", message => {
    if (message.content == "!comando") {
        var embed = new Discord.MessageEmbed()
            .setTitle("Ping del bot")
            .setDescription("Ecco la latenza del bot")
            .addField("Ping", \`\${client.ws.ping}ms\`)

        message.channel.send(embed)
    }
})`,
    v13: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        var embed = new Discord.MessageEmbed()
            .setTitle("Ping del bot")
            .setDescription("Ecco la latenza del bot")
            .addField("Ping", \`\${client.ws.ping}ms\`)

        message.channel.send({embeds: [embed]})
    }
})`
};
