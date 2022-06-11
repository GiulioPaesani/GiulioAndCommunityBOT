module.exports = {
    name: "Ban",
    aliases: ["bannare"],
    description: "**Bannare permanentemente** un utente dal server",
    category: "moderation",
    id: "1639466113",
    link: "https://www.toptal.com/developers/hastebin/momolejupe.js",
    info: "",
    video: "https://youtu.be/x-Ii6BZiVQQ?t=27",
    code: `
client.on("messageCreate", message => {
    if (message.content.startsWith("!ban")) {
        let utente = message.mentions.members.first();
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
                let embed = new Discord.MessageEmbed()
                    .setTitle(\`\${utente.user.username} bannato\`)
                    .setDescription(\`Utente bannato da \${message.author.toString()}\`)

                message.channel.send({ embeds: [embed] })
            })
    }
})`
};
