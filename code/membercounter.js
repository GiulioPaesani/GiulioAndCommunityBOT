module.exports = {
    name: "Member counter",
    aliases: ["membercounter", "canalecounter"],
    description: "Creare un **canale** con il numero di membri nel server",
    category: "utility",
    id: "1639466175",
    info: "È necessario creare un canale testuale o vocale dove il bot andrà a settare il numero di membri nel server",
    video: "",
    v12: `
setInterval(function () {
    var canale = client.channels.cache.get("idCanaleCounter");
    canale.setName(\`👾│members: \${canale.guild.memberCount}\`);
}, 1000 * 60 * 5)`,
    v13: `
setInterval(function () {
    var canale = client.channels.cache.get("idCanaleCounter");
    canale.setName(\`👾│members: \${canale.guild.memberCount}\`);
}, 1000 * 60 * 5)`
};
