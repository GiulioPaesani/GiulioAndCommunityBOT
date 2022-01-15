module.exports = {
    name: "Parolacce",
    aliases: ["parolaccia", "badwords"],
    description: "Sistema di moderazione di **parole bloccate** scelte da voi",
    category: "moderation",
    id: "1640800503",
    info: "Per aggiungere nuove parole o frasi basta inserirle all'interno dell'array parolacce, separate da un virgola",
    video: "https://youtu.be/4KlGq8kOSqA",
    v12: `
client.on("message", message => {
    if (message.channel.type == "DM") return

    if (message.member.roles.cache.has("idRuolo1") || message.member.roles.cache.has("idRuolo2")) return

    var parolacce = ["sedia", "lampada", "ciao come va"]
    var trovata = false;
    var testo = message.content;

    parolacce.forEach(parola => {
        if (message.content.toLowerCase().includes(parola.toLowerCase())) {
            trovata = true;
            testo = testo.replace(eval(\`/\${parola}/g\`), "###");
        }
    })

    if (trovata) {
        message.delete();
        var embed = new Discord.MessageEmbed()
            .setTitle("Hai detto una parolaccia")
            .setDescription("Hai scritto un messaggio con parole bloccate\\rIl tuo messaggio: " + testo)

        message.channel.send(embed)
    }`,
    v13: `
client.on("messageCreate", message => {
    if (message.channel.type == "DM") return

    if (message.member.roles.cache.has("idRuolo1") || message.member.roles.cache.has("idRuolo2")) return

    var parolacce = ["sedia", "lampada", "ciao come va"]
    var trovata = false;
    var testo = message.content;

    parolacce.forEach(parola => {
        if (message.content.toLowerCase().includes(parola.toLowerCase())) {
            trovata = true;
            testo = testo.replace(eval(\`/\${parola}/g\`), "###");
        }
    })

    if (trovata) {
        message.delete();
        var embed = new Discord.MessageEmbed()
            .setTitle("Hai detto una parolaccia")
            .setDescription("Hai scritto un messaggio con parole bloccate\\rIl tuo messaggio: " + testo)

        message.channel.send({ embeds: [embed] })
    }
})`
};
