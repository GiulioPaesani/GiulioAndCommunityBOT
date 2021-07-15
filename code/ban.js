module.exports = {
    name: "ban",
    aliases: ["bannare"],
    description: "**Bannare permanentemente** un utente dal server",
    info: "",
    video: "https://youtu.be/x-Ii6BZiVQQ?t=27",
    code: `
client.on("message", message => {
    if (message.content.startsWith("!ban")) {
        var utenteKick = message.mentions.members.first();
        if (!message.member.hasPermission('BAN_MEMBERS')) { //Controllare che l'utente abbia il permesso di bannare
            message.channel.send('Non hai il permesso');
            return;
        }
        if (!utenteKick) {
            message.channel.send('Non hai menzionato nessun utente'); //Controllare che sia stato menzionato un utente
            return;
        }
        if (!message.mentions.members.first().kickable) { //Controllare che il bot abbia il permesso di bannare
            message.channel.send('Io non ho il permesso');
            return
        }
        utenteKick.ban()
            .then(() => message.channel.send("<@" + utenteKick + ">" + " bannato"))
    }
})`
};
