module.exports = {
    name: "Value must be string",
    aliases: ["valuenostring", "embedstring"],
    description: "MessageEmbed ## must be a string / be non-empty strings.",
    info: "Dalla versione v13 in un embed o nel contenuto di un messaggio è necessarrio che tutti i valori inseriti siano stringhe, e non valori numeri o di altro tipo. Per risolvere basterà convertire il valore in stringa attraverso il `.toString()` prima di inserirlo nell'embed",
    category: "errors",
    id: "1639466153",
    link: "https://www.toptal.com/developers/hastebin/yinetuhegu.js",
    video: "",
    code: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        let variabileNumerica = 1234

        message.channel.send(variabileNumerica.toString())

        let embed = new Discord.EmbedBuilder()
            .setTitle("Titolo")
            .setDescription(variabileNumerica.toString())
            .addField(, )
            .addFields([{ name: "Titolo field", value: "Valore field" }])

        message.channel.send({ embeds: [embed] })

        let embed2 = new Discord.EmbedBuilder()
            .setTitle("Titolo")
            .setDescription("Description")
            .addFields([{ name: "Titolo field", value: variabileNumerica.toString() }])

        message.channel.send({ embeds: [embed2] })
    }
})`
};
