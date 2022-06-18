module.exports = {
    name: "Taggare",
    aliases: ["tag"],
    description: "Come **taggare** utenti, ruoli, canali e categorie",
    category: "utility",
    id: "1642321334",
    link: "https://www.toptal.com/developers/hastebin/vacutiqale.less",
    info: "",
    video: "",
    code: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        //Taggare l'utente che scrive il comando
        message.channel.send(message.author.toString());
        //Taggare un utente specifico
        message.channel.send("<@idUtente>");
        //Taggare un ruolo del server
        message.channel.send("<@&idRuolo>");
        //Taggare un canale
        message.channel.send("<#idCanale>");
        //Taggare una categoria
        message.channel.send("<#idCategoria>");
    }
})`
};
