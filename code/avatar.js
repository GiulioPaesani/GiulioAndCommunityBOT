module.exports = {
    name: "avatar",
    aliases: ["profilo", "immagineprofilo"],
    description: "Ottenere l'**immagine profilo** di un utente",
    info: "",
    video: "",
    code: `
client.on("message", message => {
    if (message.content.startsWith("!avatar")) {
        if (message.content.trim() == "!avatar") {
            var utente = message.member;
        }
        else {
            var utente = message.mentions.members.first();
        }
        if (!utente) {
            message.channel.send("Utente non trovato")
        }
        var embed = new Discord.MessageEmbed()
            .setTitle(utente.user.tag)
            .setDescription("L'avatar di questo utente")
            .setImage(utente.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
        message.channel.send(embed)
    }
})`
};
