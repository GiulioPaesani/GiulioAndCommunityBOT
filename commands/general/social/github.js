module.exports = {
    name: "github",
    aliases: ["repository", "repo"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Link alle repository pubbliche di Giulio",
    syntax: "!github",
    category: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var embed = new Discord.MessageEmbed()
            .setTitle("GitHub")
            .setDescription("Tutti i link github alle **repository pubbliche** di Giulio")
            .addField("<:GiulioAndCommunityBOT:823196000650788944> GiulioAndCommunity BOT", `
[Clicca qui](https://github.com/GiulioPaesani/GiulioAndCommunityBOT) - Tutto il codice open-source del bot privato del server`)
            .addField("<:GiulioAndTutorial:823196000922894387> GiulioAndTutorial", `
[Clicca qui](https://github.com/GiulioPaesani/GiulioAndTutorial) - I codici e file di tutti i tutorial Discord.js trattati su YouTube`)
            .addField("<:giulioportfolio:928576580844945429> Giulio Portfolio", `
[Clicca qui](https://github.com/GiulioPaesani/GiulioPortfolio) - Pagina del proprio curriculum realizzata da Giulio`)
            .setThumbnail("https://i.postimg.cc/rpKN8qn2/Github-Logo.png")

        message.channel.send({ embeds: [embed] })
            .catch(() => { })
    },
};