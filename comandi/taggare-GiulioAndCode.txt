client.on("message", message => {
    if (message.content == "!comando") {
        //Taggare l'utente che scrive il comando
        message.channel.send(message.author.toString());
        //Taggare un utente specifico
        message.channel.send("<@idUtente>");
        //Taggare un ruolo del server
        message.channel.send("<@&idRuolo>");
        //Taggare un canale o una categoria
        message.channel.send("<#idCanale/Categoria>");
    }
})
