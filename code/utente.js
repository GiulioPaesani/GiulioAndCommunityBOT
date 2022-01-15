module.exports = {
    name: "Utente",
    aliases: ["user"],
    description: "Ottenere un **utente**",
    category: "manage",
    id: "1639466278",
    info: "",
    video: "",
    v12: `
var utente = client.users.cache.get("idUtente");
utente.send("messaggio");`,
    v13: `
var utente = client.users.cache.get("idUtente");
utente.send("messaggio");`
};
