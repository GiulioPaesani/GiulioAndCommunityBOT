module.exports = {
    name: "pagine",
    aliases: ["embedpagine","pagineembed"],
    description: "Creare un **embed** con diverse **reazioni**, che cliccandoci cambiano il contenuto del messaggio",
    info: "",
    video: "",
    code: `
client.on("message", message => {
    if (message.content == "!comando") {
        var totalPage = 4; //Ricordati qui si settare le tue pagine totali
        var page = 1;
        //TUTTE LE PAGINE - Puoi crearne quante ne vuoi
        var page1 = new Discord.MessageEmbed()
            .setTitle("PAGINA 1")
            .setDescription("Questa è la prima pagina")
            .setFooter("Page 1/" + totalPage)
        var page2 = new Discord.MessageEmbed()
            .setTitle("PAGINA 2")
            .setDescription("Questa è la seconda pagina")
            .setFooter("Page 2/" + totalPage)
        var page3 = new Discord.MessageEmbed()
            .setTitle("PAGINA 3")
            .setDescription("Questa è la terza pagina")
            .setFooter("Page 3/" + totalPage)
        var page4 = new Discord.MessageEmbed()
            .setTitle("PAGINA 4")
            .setDescription("Questa è la quarta pagina")
            .setFooter("Page 4/" + totalPage)
        message.channel.send(page1).then(msg => {
            msg.react('◀').then(r => { //Puoi se vuoi personalizzare le emoji
                msg.react('▶')
                const reactIndietro = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id
                const reactAvanti = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id
                const paginaIndietro = msg.createReactionCollector(reactIndietro)
                const paginaAvanti = msg.createReactionCollector(reactAvanti)
                paginaIndietro.on('collect', (r, u) => { //Freccia indietro
                    page--
                    page < 1 ? page = totalPage : ""
                    msg.edit(eval("page" + page))
                    r.users.remove(r.users.cache.filter(u => u === message.author).first())
                })
                paginaAvanti.on('collect', (r, u) => { //Freccia avanti
                    page++
                    page > totalPage ? page = 1 : ""
                    msg.edit(eval("page" + page))
                    r.users.remove(r.users.cache.filter(u => u === message.author).first())
                })
            })
        })
    }
})`
};
