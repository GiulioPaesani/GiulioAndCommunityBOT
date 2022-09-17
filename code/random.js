module.exports = {
    name: "Random",
    aliases: ["messaggiorandom", "randommessage", "randomembed"],
    description: "Far scrivere al bot un messaggio o un embed **randomico** tra alcuni scelti",
    category: "utility",
    id: "1639466197",
    link: "https://www.toptal.com/developers/hastebin/texuhupozi.jss",
    info: "",
    video: "",
    code: `
client.on("messageCreate", message => {
    //Random messaggi normali
    if (message.content == "!comando") {
        let messaggi = ["Ciao, come va?", "Ehi come stai?", "Tutto bene?"] //Qui potete elencare tutti i messaggi che volete separati da una virgola
        message.channel.send(messaggi[Math.floor(Math.random() * messaggi.length)]);
    }
    //Random messaggi embed
    if (message.content == "!comando2") {
        let embed1 = new Discord.EmbedBuilder()
            .setTitle("Embed1")
            .setDescription("Questo è il primo embed")
        let embed2 = new Discord.EmbedBuilder()
            .setTitle("Embed1")
            .setDescription("Questo è il secondo embed")
        let embed3 = new Discord.EmbedBuilder()
            .setTitle("Embed1")
            .setDescription("Questo è il terzo embed")
        let messaggi = [embed1, embed2, embed3]
        message.channel.send({ embeds: [messaggi[Math.floor(Math.random() * messaggi.length)]] });
    }
})`
};
