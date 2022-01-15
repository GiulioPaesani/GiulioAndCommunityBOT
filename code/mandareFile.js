module.exports = {
    name: "Mandare file",
    aliases: ["file", "files"],
    description: "Mandare **file** tramite il bot in chat",
    category: "utility",
    id: "1640800877",
    info: "",
    video: "",
    v12: `
client.on("message", message => {
    if (message.content == "!comando") {
        message.channel.send("Messaggio", { files: ["./Immagine.png"] })

        //Più file
        message.channel.send("Messaggio", { files: ["./Immagine.png", "https://google.it/immagine.png"] })

        //Con embed
        var embed = new Discord.MessageEmbed()
            .setTitle("Titolo")
            .setDescription("Descrizione")

        message.channel.send({ embed: embed, files: ["./Immagine.png"] })
    }
})`,
    v13: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        message.channel.send({ content: "Messaggio", files: ["./Immagine.png"] })

        //Più file
        message.channel.send({ content: "Messaggio", files: ["./Immagine.png", "https://google.it/immagine.png"] })

        //Con embed
        var embed = new Discord.MessageEmbed()
            .setTitle("Titolo")
            .setDescription("Descrizione")

        message.channel.send({ embeds: [embed], files: ["./Immagine.png"] })
    }
})`
};
