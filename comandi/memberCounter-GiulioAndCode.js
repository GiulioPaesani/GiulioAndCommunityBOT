client.on("guildMemberAdd", member => { //Update canale quando entra un utente dal server
    var canale = client.channels.cache.get("idCanaleCounter")
    canale.setName("👾│members: " + member.guild.memberCount)
});
client.on("guildMemberRemove", member => { //Update canale quando esce un utente dal server
    var canale = client.channels.cache.get("idCanaleCounter")
    canale.setName("👾│members: " + member.guild.memberCount)
});