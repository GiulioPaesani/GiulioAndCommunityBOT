module.exports = {
    name: "membercounter",
    aliases: ["canalecounter"],
    description: "Creare un **canale** con il numero di membri nel server",
    info: `Prima di creare il comando è necessario creare il canale dove vengono segnati i numeri di membri, potete scegliere nel creare un canale testuale o vocale. Una volta fatto copiare l'id nel codice
Inoltre è necessario andare nelle impostazioni del bot sul [sito developer](https://discord.com/developers/applications) e andare nella sezione "Bot". Attivare le due opzioni in "Privileged Gateway Intents" (sia PRESENCE INTENT che SERVER MEMBERS INTENT)`,
    video: "",
    code: `
client.on("guildMemberAdd", member => { //Update canale quando entra un utente dal server
    var canale = client.channels.cache.get("idCanaleCounter")
    canale.setName("members: " + member.guild.memberCount)
});
client.on("guildMemberRemove", member => { //Update canale quando esce un utente dal server
    var canale = client.channels.cache.get("idCanaleCounter")
    canale.setName("members: " + member.guild.memberCount)
});`
};
