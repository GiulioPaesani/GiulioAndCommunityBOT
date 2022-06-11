module.exports = {
    name: "Canale",
    aliases: ["channel"],
    description: "Ottenere un **canale testuale/vocale/altro**",
    category: "manage",
    id: "1642321287",
    link: "https://www.toptal.com/developers/hastebin/ibayesakox.kotlin",
    info: "",
    video: "",
    code: `
const canale = client.channels.cache.get("idCanale");
canale.send("Messaggio");`
};
