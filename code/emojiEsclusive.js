module.exports = {
    name: "Emoji esclusive",
    aliases: ["emoji", "emoji role"],
    description: "Creare un emoji eslusiva per alcuni ruoli specificati",
    category: "manage",
    id: "1654679547",
    link: "https://www.toptal.com/developers/hastebin/gihaxudaxe.less",
    info: "Attraverso una funzione è possicile creare una classica emoji nel server che però è visibile e utilizzabile solo dai ruoli che abbiamo specificato",
    video: "",
    code: `
client.on("messageCreate", message => {
    if (message.content == "!comando") {
        message.guild.emojis.create("nomeFile.png", "nomeEmoji", {roles: ["idRuolo1","idRuolo2"]}) //Si possono inserire quanti ruoli si vogliono
    }
})`
};
