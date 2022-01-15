module.exports = {
    name: "Modificare",
    aliases: ["editmessage", "edit"],
    description: "**Modificare** il contenuto di un messaggio appena inviato o inviato in passato",
    category: "utility",
    id: "1639466179",
    info: "",
    video: "",
    v12: `
client.on("message", message => {
    //Modificare un messaggio appena inviato
    if (message.content == "!comando") {
        message.channel.send("Ciao")
            .then(msg => {
                //Appena inviato
                msg.edit("Messaggio modificato")
                //Dopo due secondi
                setTimeout(function () {
                    msg.edit("Messaggio modificato")
                }, 2000) //Personalizzabile
            })
    }
    //Modificare un messaggio specifico nel server
    if (message.content == "!comando") {
        var canale = client.channels.cache.get("idCanale") //Settare id canale in cui si trova il messaggio
        canale.messages.fetch("idMessaggio") //Settare id messaggio
            .then(msg => {
                msg.edit("Messaggio modificato")
            })
    }
})`,
    v13: `
client.on("messageCreate", message => {
    //Modificare un messaggio appena inviato
    if (message.content == "!comando") {
        message.channel.send("Ciao")
            .then(msg => {
                //Appena inviato
                msg.edit("Messaggio modificato")
                //Dopo due secondi
                setTimeout(function () {
                    msg.edit("Messaggio modificato")
                }, 2000) //Personalizzabile
            })
    }
    //Modificare un messaggio specifico nel server
    if (message.content == "!comando") {
        var canale = client.channels.cache.get("idCanale") //Settare id canale in cui si trova il messaggio
        canale.messages.fetch("idMessaggio") //Settare id messaggio
            .then(msg => {
                msg.edit("Messaggio modificato")
            })
    }
})`
};
