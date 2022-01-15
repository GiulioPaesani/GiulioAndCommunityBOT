module.exports = {
    name: "Random",
    aliases: ["messaggiorandom", "randommessage", "randomembed"],
    description: "Far scrivere al bot un messaggio o un embed **randomico** tra alcuni scelti",
    category: "utility",
    id: "1639466197",
    info: "",
    video: "",
    v12: `
client.on("message", message => {
    //Random messaggi normali
    if (message.content == "!comando") {
        var messaggi = ["Ciao, come va?", "Ehi come stai?", "Tutto bene?"] //Qui potete elencare tutti i messaggi che volete separati da una virgola
        message.channel.send(messaggi[Math.floor(Math.random() * messaggi.length)]);
    }
    //Random messaggi embed
    if (message.content == "!comando2") {
        var embed1 = new Discord.MessageEmbed()
            .setTitle("Embed1")
            .setDescription("Questo è il primo embed")
        var embed2 = new Discord.MessageEmbed()
            .setTitle("Embed1")
            .setDescription("Questo è il secondo embed")
        var embed3 = new Discord.MessageEmbed()
            .setTitle("Embed1")
            .setDescription("Questo è il terzo embed")
        var messaggi = [embed1, embed2, embed3]
        message.channel.send(messaggi[Math.floor(Math.random() * messaggi.length)]);
    }
})`,
    v13: `
client.on("messageCreate", message => {
    //Random messaggi normali
    if (message.content == "!comando") {
        var messaggi = ["Ciao, come va?", "Ehi come stai?", "Tutto bene?"] //Qui potete elencare tutti i messaggi che volete separati da una virgola
        message.channel.send(messaggi[Math.floor(Math.random() * messaggi.length)]);
    }
    //Random messaggi embed
    if (message.content == "!comando2") {
        var embed1 = new Discord.MessageEmbed()
            .setTitle("Embed1")
            .setDescription("Questo è il primo embed")
        var embed2 = new Discord.MessageEmbed()
            .setTitle("Embed1")
            .setDescription("Questo è il secondo embed")
        var embed3 = new Discord.MessageEmbed()
            .setTitle("Embed1")
            .setDescription("Questo è il terzo embed")
        var messaggi = [embed1, embed2, embed3]
        message.channel.send({ embeds: [messaggi[Math.floor(Math.random() * messaggi.length)]] });
    }
})`
};
