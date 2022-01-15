module.exports = {
    name: "Value must be string",
    aliases: ["valuenostring", "embedstring"],
    description: "MessageEmbed ## must be a string / be non-empty strings.",
    info: "Dalla versione v13 in un embed o nel contenuto di un messaggio è necessarrio che tutti i valori inseriti siano stringhe, e non valori numeri o di altro tipo. Per risolvere basterà convertire il valore in stringa attraverso il `.toString()` prima di inserirlo nell'embed",
    category: "errors",
    id: "1639466153",
    video: "",
    v12: `
//Errore non presente in Discord.js v12`,
    v13: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        var variabileNumerica = 1234

        message.channel.send(variabileNumerica.toString())

        var embed = new Discord.MessageEmbed()
            .setTitle("Titolo")
            .setDescription(variabileNumerica.toString())
            .addField("Titolo field", "Valore field")

        message.channel.send({ embeds: [embed] })

        var embed = new Discord.MessageEmbed()
            .setTitle("Titolo")
            .setDescription("Description")
            .addField("Titolo field", variabileNumerica.toString())

        message.channel.send({ embeds: [embed] })
    }
})
`
};
