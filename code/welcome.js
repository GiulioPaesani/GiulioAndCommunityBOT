module.exports = {
    name: "Welcome",
    aliases: ["goodbye", "benvenuto", "addio"],
    description: "Messaggio di **benvenuto** e **addio** quando un utente entra/esce dal server",
    category: "utility",
    id: "1639466282",
    info: "",
    video: "",
    v12: `
//BENVENUTO
client.on("guildMemberAdd", member => {
    if (member.user.bot) return
    var embed = new Discord.MessageEmbed()
        .setTitle("WELCOME")
        .setDescription(\`Ciao \${member.toString()}, benvenuto in \${member.guild.name}. Sei il **\${member.guild.memberCount}° Membro**\`)

    client.channels.cache.get("idCanale").send(embed); 
})
//ADDIO
client.on("guildMemberRemove", member => {
    if (member.user.bot) return
    var embed = new Discord.MessageEmbed()
        .setTitle("GOODBEY")
        .setDescription(\`Ciao \${member.toString()}, ci rivediamo presto qua in \${member.guild.name}\`)

    client.channels.cache.get("idCanale").send(embed); 
})`,
    v13: `
//BENVENUTO
client.on("guildMemberAdd", member => {
    if (member.user.bot) return
    var embed = new Discord.MessageEmbed()
        .setTitle("WELCOME")
        .setDescription(\`Ciao \${member.toString()}, benvenuto in \${member.guild.name}. Sei il **\${member.guild.memberCount}° Membro**\`)

    client.channels.cache.get("idCanale").send({embeds: [embed]}); 
})
//ADDIO
client.on("guildMemberRemove", member => {
    if (member.user.bot) return
    var embed = new Discord.MessageEmbed()
        .setTitle("GOODBEY")
        .setDescription(\`Ciao \${member.toString()}, ci rivediamo presto qua in \${member.guild.name}\`)

    client.channels.cache.get("idCanale").send({embeds: [embed]}); 
})`
};
