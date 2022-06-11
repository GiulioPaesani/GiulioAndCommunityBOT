module.exports = {
    name: "Welcome",
    aliases: ["goodbye", "benvenuto", "addio"],
    description: "Messaggio di **benvenuto** e **addio** quando un utente entra/esce dal server",
    category: "utility",
    id: "1639466282",
    link: "https://www.toptal.com/developers/hastebin/izezirotap.js",
    info: "",
    video: "",
    code: `
//BENVENUTO
client.on("guildMemberAdd", member => {
    if (member.user.bot) return
    let embed = new Discord.MessageEmbed()
        .setTitle("WELCOME")
        .setDescription(\`Ciao \${member.toString()}, benvenuto in \${member.guild.name}. Sei il **\${member.guild.memberCount}° Membro**\`)

    client.channels.cache.get("idCanale").send({embeds: [embed]}); 
})
//ADDIO
client.on("guildMemberRemove", member => {
    if (member.user.bot) return
    let embed = new Discord.MessageEmbed()
        .setTitle("GOODBEY")
        .setDescription(\`Ciao \${member.toString()}, ci rivediamo presto qua in \${member.guild.name}\`)

    client.channels.cache.get("idCanale").send({embeds: [embed]}); 
})`
};
