module.exports = {
    name: "welcome",
    aliases: ["goodbye", "benvenuto", "addio"],
    description: "Messaggio di **benvenuto** e **addio** quando un utente entra/esce dal server",
    info: "Prima di usare il comando, è necessario andare nelle impostazioni del bot sul [sito developer](https://discord.com/developers/applications) e andare nella sezione \"Bot\". Attivare le due opzioni in \"Privileged Gateway Intents\" (sia PRESENCE INTENT che SERVER MEMBERS INTENT)",
    video: "",
    code: `
//BENVENUTO
client.on("guildMemberAdd", member => {
    if (member.user.bot) return
    var canale = client.channels.cache.get("idCanale") //Settare il canale di benvenuto
    canale.send(\`
-------------- WELCOME --------------
Ciao \${member.toString()}, benvenuto in \${member.guild.name}
Sei il **\${member.guild.memberCount}° Membro**\`)
});
//ADDIO
client.on("guildMemberRemove", member => {
    if (member.user.bot) return
    var canale = client.channels.cache.get("idCanale") //Settare il canale di addio
    canale.send(\`
-------------- GOODBYE --------------
Ciao \${member.toString()}, ci rivediamo presto qua in \${member.guild.name}\`)
}); `
};
