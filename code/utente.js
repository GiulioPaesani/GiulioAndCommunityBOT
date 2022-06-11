module.exports = {
    name: "Utente",
    aliases: ["user", "messaggio privato", "dm message"],
    description: "Ottenere un **utente**",
    category: "manage",
    id: "1639466278",
    link: "https://www.toptal.com/developers/hastebin/xakutusovo.csharp",
    info: "",
    video: "",
    code: `
let utente = client.users.cache.get("idUtente");
utente.send("messaggio")
    .catch(() =>{ /*L'utente ha i DM chiusi*/})`
};
