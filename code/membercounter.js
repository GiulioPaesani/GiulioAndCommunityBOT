module.exports = {
    name: "Member counter",
    aliases: ["membercounter", "canalecounter"],
    description: "Creare un **canale** con il numero di membri nel server",
    category: "utility",
    id: "1639466175",
    link: "https://www.toptal.com/developers/hastebin/ebovojahil.js",
    info: "È necessario creare un canale testuale o vocale dove il bot andrà a settare il numero di membri nel server",
    video: "",
    code: `
setInterval(function () {
    //Counter dei membri nel server
    const canale = client.channels.cache.get("idCanaleCounter");
    canale.setName(\`👾│members: \${canale.guild.memberCount}\`);

    //Counter dei membri con un ruolo specifico nel server
    const canale2 = client.channels.cache.get("idCanaleCounter");
    canale2.setName(\`👾│members: \${canale2.guild.roles.cache.get("idRuolo").members.cache.size}\`); //Settare ruolo
}, 1000 * 60 * 5)`
};
