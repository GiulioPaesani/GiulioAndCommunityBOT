module.exports = {
    name: "random",
    aliases: ["messaggiorandom","randommessage","randomembed"],
    description: "Far scrivere al bot un messaggio o un embed **randomico** tra alcuni scelti",
    info: "",
    video: "",
    code: `
client.on("message", message => {
    //Random messaggi normali
    if (message.content == "!comando") {
        var messaggi = ["Ciao, come va?", "Ehi come stai?", "Tutto bene?"] //Qui potete elencare tutti i messaggi che volete separati da una virgola
        var random = Math.floor(Math.random() * messaggi.length);
        message.channel.send(messaggi[random]);
    }
    //Random messaggi embed
    if (message.content == "!comando2") {
        //Tutti gli embed
        var embed1 = new Discord.MessageEmbed()
            .setTitle("Embed1")
            .setDescription("Questo è il primo embed")
        var embed2 = new Discord.MessageEmbed()
            .setTitle("Embed1")
            .setDescription("Questo è il secondo embed")
        var embed3 = new Discord.MessageEmbed()
            .setTitle("Embed1")
            .setDescription("Questo è il terzo embed")
        var embed4 = new Discord.MessageEmbed()
            .setTitle("Embed1")
            .setDescription("Questo è il quarto embed")
        var messaggi = [embed1, embed2, embed3, embed4] //Qui potete elencare tutti gli embed che volete separati da una virgola
        var random = Math.floor(Math.random() * messaggi.length);
        message.channel.send(messaggi[random]);
    }
})`
};
