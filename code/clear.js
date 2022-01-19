module.exports = {
    name: "Clear",
    aliases: ["eliminaremessaggi", "delete", "deletemessage"],
    description: "**Eliminare** un tot di messaggi precedenti al comando",
    category: "commands",
    id: "1639466137",
    info: "",
    video: "https://youtu.be/Cr1yobtZd4c?t=389",
    v12: `
client.on("message", message => {
    if (message.content.startsWith("!clear")) {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.channel.send('Non hai il permesso');
        }
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.channel.send('Non ho il permesso');
        }
        var count = parseInt(message.content.split(/\\s+/)[1]);
        if (!count) {
            return message.channel.send("Inserisci un numero valido")
        }
        if (count > 100) {
            return message.channel.send("Non puoi cancellare più di 100 messaggi")
        }
        message.channel.bulkDelete(count, true)
        message.channel.send(count + " messaggi eliminati").then(msg => {
            msg.delete({ timeout: 5000 })
        })
    }
})`,
    v13: `
client.on("messageCreate", message => {
    if (message.content.startsWith("!clear")) {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            return message.channel.send('Non hai il permesso');
        }
        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) {
            return message.channel.send('Non ho il permesso');
        }
        var count = parseInt(message.content.split(/\\s+/)[1]);
        if (!count) {
            return message.channel.send("Inserisci un numero valido")
        }
        if (count > 100) {
            return message.channel.send("Non puoi cancellare più di 100 messaggi")
        }
        message.channel.bulkDelete(count, true)
        message.channel.send(count + " messaggi eliminati").then(msg => {
            setTimeout(() => msg.delete(), 5000)
        })
    }
})`
};
