client.on("message", message => {
    if (message.content == "!comando") {
        if (message.member.roles.cache.has("idRuolo")) {
            message.channel.send("Questo utente ha questo ruolo");
        } else {
            message.channel.send("Questo utente non ha questo ruolo");
        }
    }
})