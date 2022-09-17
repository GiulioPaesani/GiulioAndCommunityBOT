module.exports = {
    name: "Mandare file",
    aliases: ["file", "files"],
    description: "Mandare **file** tramite il bot in chat",
    category: "utility",
    id: "1640800877",
    link: "https://www.toptal.com/developers/hastebin/ukukilocus.js",
    info: "",
    video: "",
    code: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        message.channel.send({ content: "Messaggio", files: ["./Immagine.png"] })

        //Più file
        message.channel.send({ content: "Messaggio", files: ["./Immagine.png", "https://google.it/immagine.png"] })

        //Con embed
        let embed = new Discord.EmbedBuilder()
            .setTitle("Titolo")
            .setDescription("Descrizione")

        message.channel.send({ embeds: [embed], files: ["./Immagine.png"] })
    }
})`
};
