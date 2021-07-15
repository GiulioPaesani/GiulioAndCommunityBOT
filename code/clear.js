module.exports = {
    name: "clear",
    aliases: ["eliminaremessaggi","delete","deletemessage"],
    description: "**Eliminare** un tot di messaggi precedenti al comando",
    info: "",
    video: "https://youtu.be/Cr1yobtZd4c?t=389",
    code: `
client.on("message", message => {
    if (message.content.startsWith("!clear")) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) { //Controllare che l'utente abbia il permesso di cancellare messaggi
            message.channel.send('Non hai il permesso');
            return;
        }
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) { //Controllare che il bot abbia il permesso di cancellare messaggi
            message.channel.send('Non ho il permesso');
            return;
        }
        var count = message.content.slice(7); //Ottenere il numero inserito dall'utente
        count = parseInt(count);
        if (!count) {
            message.channel.send("Inserisci un numero valido")
            return
        }
        message.channel.bulkDelete(count, true)
        message.channel.send(count + " messaggi eliminati").then(msg => {
            msg.delete({ timeout: 1000 })
        })
    }
})`
};
