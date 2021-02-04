if (message.content == "!comando") {
    //Se vuoi mandare il messaggio all'utente che scrive il comando
    message.author.send("Messaggio privato");

    //Se vuoi mandare il messaggio a un utente specifico
    var utente = client.users.cache.get("idUtente");
    utente.send("messaggio");
}