module.exports = {
    name: "Unmute",
    aliases: ["smutare"],
    description: "**Smutare** un utente nel server",
    category: "moderation",
    id: "1641211896",
    info: "",
    video: "",
    v12: `
client.on("message", message => {
    if (message.content.startsWith("!unmute")) {
        var utente = message.mentions.members.first();
        if (!message.member.hasPermission("MANAGE_ROLES")) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }
        
        utente.roles.remove("idRuolo")

        var embed = new Discord.MessageEmbed()
            .setTitle(\`\${utente.user.username} smutato\`)
            .setDescription(\`Utente smutato da \${message.author.toString()}\`)

        message.channel.send(embed)
    }
})`,
    v13: `
client.on("messageCreate", message => {
    if (message.content.startsWith("!unmute")) {
        var utente = message.mentions.members.first();
        if (!message.member.permissions.has("MANAGE_ROLES")) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }

        utente.roles.remove("idRuolo")

        var embed = new Discord.MessageEmbed()
            .setTitle(\`\${utente.user.username} smutato\`)
            .setDescription(\`Utente smutato da \${message.author.toString()}\`)

        message.channel.send({ embeds: [embed] })
    }
})`
};
