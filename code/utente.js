module.exports = {
    name: "utente",
    aliases: ["user"],
    description: "Ottenere un **utente**",
    info: "",
    video: "",
    code: `
var utente = client.users.cache.get("idUtente");
utente.send("messaggio");`
};
