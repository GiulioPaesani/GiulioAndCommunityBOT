module.exports = {
    name: "taggare",
    aliases: ["tag"],
    description: "Come **taggare** utenti, ruoli, canali e categorie",
    info: "",
    video: "",
    code: `
client.on("message", message => {
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
