module.exports = {
    name: "Message event deprecated",
    aliases: ["messagedreprecated", "deprecationwarning"],
    description: "DeprecationWarning: The message event is deprecated. Use messageCreate instead",
    info: "Dalle versione v13 l'evento \"message\" è stato rinominato in \"messageCreate\", quindi il vecchio nome è ancora funzionante ma deprecato, quindi si consiglia di sostituire il nome",
    category: "errors",
    id: "1641640269",
    link: "https://www.toptal.com/developers/hastebin/obihoxirus.coffeescript",
    video: "",
    code: `
//Cambiare tutti i client.on("message", () => {}) con client.on("messageCreate", () => {})
client.on("messageCreate", message => {
    //Codice
})`
};
