module.exports = {
    name: "cancellare",
    aliases: ["deletemessage","delete"],
    description: "**Cancellare** il comando o il messaggio del bot",
    info: "",
    video: "",
    code: `
client.on("message", message => {
    if (message.content == "!comando") {
        //Cancellare il comando dell'utente
        message.delete(); //Immediatamente
        message.delete({ timeout: 3000 }) //Dopo tre secondi (personalizzabile)
        //Cancellare il messaggio del bot
        message.channel.send("Ciao")
            .then(msg => {
                msg.delete(); //Immediatamente
                msg.delete({ timeout: 3000 }) //Dopo tre secondi (personalizzabile)
            })
    }
})`
};
