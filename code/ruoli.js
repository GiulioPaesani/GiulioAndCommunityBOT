module.exports = {
    name: "Ruoli",
    aliases: ["dareruolo", "rimuovereruolo"],
    description: "Come **dare** o **rimuovere** un ruolo specifico all'utente",
    category: "manage",
    id: "1639466215",
    info: "",
    video: "",
    v12: `
client.on("message", message => {
    if (message.content == "!comando") {
        //DARE UN RUOLO
        message.member.roles.add("idRuolo") //A chi ha scritto il comando
        var utente = message.guild.members.cache.get("idUtente")
        utente.roles.add("idRuolo") //A un utente specifico
        //RIMUOVERE UN RUOLO
        message.member.roles.remove("idRuolo") //A chi ha scritto il comando
        var utente = message.guild.members.cache.get("idUtente")
        utente.roles.remove("idRuolo") //A un utente specifico
    }
})`,
    v13: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        //DARE UN RUOLO
        message.member.roles.add("idRuolo") //A chi ha scritto il comando
        var utente = message.guild.members.cache.get("idUtente")
        utente.roles.add("idRuolo") //A un utente specifico
        //RIMUOVERE UN RUOLO
        message.member.roles.remove("idRuolo") //A chi ha scritto il comando
        var utente = message.guild.members.cache.get("idUtente")
        utente.roles.remove("idRuolo") //A un utente specifico
    }
})`
};
