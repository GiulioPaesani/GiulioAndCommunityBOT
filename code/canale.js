module.exports = {
    name: "canale",
    aliases: ["channel"],
    description: "Ottenere un **canale testuale/vocale**",
    info: "",
    video: "",
    code: `
var canale = client.channels.cache.get("idCanale");
canale.send("Messaggio");`
};
