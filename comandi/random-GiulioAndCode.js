client.on("message", message => {
    if (message.content == "!comando") {
        var messaggi = ["Ciao, come va?", "Ehi come stai?", "Tutto bene?"] //Qui potete elencare tutti i messaggi che volete separati da una virgola
        var random = Math.floor(Math.random() * messaggi.length);
        message.channel.send(messaggi[random]);
    }
})