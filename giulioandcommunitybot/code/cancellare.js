module.exports = {
    name: "Cancellare",
    aliases: ["deletemessage", "delete"],
    description: "**Cancellare** il comando o il messaggio del bot",
    category: "manage",
    id: "1639466365",
    link: "https://www.toptal.com/developers/hastebin/ehirequqex.js",
    info: "",
    video: "",
    code: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        //Cancellare il comando dell'utente
        message.delete(); //Immediatamente
        setTimeout(() => {
            message.delete()
        }, 3000) //Dopo tre secondi (personalizzabile)
        
        //Cancellare il messaggio del bot
        message.channel.send("Ciao")
            .then(msg => {
                msg.delete(); //Immediatamente
                setTimeout(() => {
                    msg.delete()
                }, 3000) //Dopo tre secondi (personalizzabile)
            })
    }
})`
};
