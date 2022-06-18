module.exports = {
    name: "Ruoli",
    aliases: ["dareruolo", "rimuovereruolo"],
    description: "Come **dare** o **rimuovere** un ruolo specifico all'utente",
    category: "manage",
    id: "1639466215",
    link: "https://www.toptal.com/developers/hastebin/saleruvaba.csharp",
    info: "",
    video: "",
    code: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        //Dare un ruolo
        message.member.roles.add("idRuolo") //A chi ha scritto il comando
        
        let utente = message.guild.members.cache.get("idUtente")
        utente.roles.add("idRuolo") //A un utente specifico

        //Rimuovere un ruolo
        message.member.roles.remove("idRuolo") //A chi ha scritto il comando

        let utente = message.guild.members.cache.get("idUtente")
        utente.roles.remove("idRuolo") //A un utente specifico
    }
})`
};
