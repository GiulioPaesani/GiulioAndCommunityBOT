//Messaggio di benvenuto
client.on("guildMemberAdd", (member) => {
    //console.log(member.guild); Per avere tutte le info del server
    client.channels.cache.get("793781905740922900").send("Ciao " + member.toString() + " benvunuto in **" + member.guild.name + "**\rSei il **" + member.guild.memberCount + "° membro**");
})
//Messaggio di Addio
client.on("guildMemberRemove", (member) => {
    client.channels.cache.get("793781905740922900").send("Ciao ciao" + member.toString() + ", torna presto!");
})