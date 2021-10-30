module.exports = {
    name: "github",
    aliases: [],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands],
    async execute(message, args, client) {
        let embed = new Discord.MessageEmbed()
            .setTitle("GITHUB")
            .setDescription(`Questi sono tutti i link Github di GiulioAndCode
                
<:GiulioAndCommunityBOT:823196000650788944> GiulioAndCommunity BOT - [Clicca qui](https://github.com/GiulioPaesani/GiulioAndCommunityBOT)
<:GiulioAndTutorial:823196000922894387> GiulioAndTutorial - [Clicca qui](https://github.com/GiulioPaesani/GiulioAndTutorial)
<:GiulioAndCode:835880225266466876> GiulioAndCode Site - [Clicca qui](https://github.com/GiulioPaesani/GiulioAndCodeSite)`)
            .setThumbnail("https://i.postimg.cc/mrXPWCHK/Senza-titolo-1.jpg")

        message.channel.send(embed)
    },
};