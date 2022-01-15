module.exports = {
    name: "Ban",
    aliases: ["bannare"],
    description: "**Bannare permanentemente** un utente dal server",
    category: "moderation",
    id: "1639466113",
    info: "",
    video: "https://youtu.be/x-Ii6BZiVQQ?t=27",
    v12: `
client.on("message", message => {
    if (message.content.startsWith("!ban")) {
        var utente = message.mentions.members.first();
        if (!message.member.hasPermission('BAN_MEMBERS')) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }
        if (!utente.bannable) {
            return message.channel.send('Io non ho il permesso');
        }
        utente.ban()
            .then(() => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(\`\${utente.user.username} bannato\`)
                    .setDescription(\`Utente bannato da \${message.author.toString()}\`)

                message.channel.send(embed)
            })
    }
})`,
    v13: `
client.on("messageCreate", message => {
    if (message.content.startsWith("!ban")) {
        var utente = message.mentions.members.first();
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }
        if (!utente.bannable) {
            return message.channel.send('Io non ho il permesso');
        }
        utente.ban()
            .then(() => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(\`\${utente.user.username} bannato\`)
                    .setDescription(\`Utente bannato da \${message.author.toString()}\`)

                message.channel.send({ embeds: [embed] })
            })
    }
})`
};
