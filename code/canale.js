module.exports = {
    name: "Canale",
    aliases: ["channel"],
    description: "Ottenere un **canale testuale/vocale/altro**",
    category: "manage",
    id: "1642321287",
    info: "",
    video: "",
    v12: `
let canale = client.channels.cache.get("idCanale");
canale.send("Messaggio");`,
    v13: `
let canale = client.channels.cache.get("idCanale");
canale.send("Messaggio");`
};
