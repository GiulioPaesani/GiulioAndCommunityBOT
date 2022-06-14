module.exports = {
    name: "Avatar",
    aliases: ["profilo", "immagineprofilo"],
    description: "Ottenere l'**immagine profilo** di un utente",
    id: "1639466106",
    link: "https://www.toptal.com/developers/hastebin/ozizedotig.csharp",
    category: "commands",
    info: "",
    video: "",
    code: `
client.on("message", message => {
    if (message.content.startsWith("!avatar")) {
        if (message.content.trim() == "!avatar") {
            let utente = message.member;
        }
        else {
            let utente = message.mentions.members.first();
        }
        if (!utente) {
            return message.channel.send("Utente non trovato")
        }
        let embed = new Discord.MessageEmbed()
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
