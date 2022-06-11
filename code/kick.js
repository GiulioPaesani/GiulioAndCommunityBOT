module.exports = {
    name: "Kick",
    aliases: ["kickare", "kikkare", "espellere"],
    description: "**Espellere** un utente dal server",
    category: "moderation",
    id: "1642321294",
    link: "https://www.toptal.com/developers/hastebin/ifolacufev.js",
    info: "",
    video: "https://youtu.be/x-Ii6BZiVQQ?t=27",
    code: `
client.on("messageCreate", message => {
    if (message.content.startsWith("!kick")) {
        let utente = message.mentions.members.first();
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.channel.send('Non hai il permesso');
        }
        if (!utente) {
            return message.channel.send('Non hai menzionato nessun utente');
        }
        if (!utente.kickable) {
            return message.channel.send('Io non ho il permesso');
        }
        utente.kick()
            .then(() => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(\`\${utente.user.username} kickato\`)
                    .setDescription(\`Utente kickato da \${message.author.toString()}\`)

                message.channel.send({ embeds: [embed] })
            })
    }
})`
};
