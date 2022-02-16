module.exports = {
    name: "link",
    aliases: ["social"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Tutti i social e contatti di Giulio",
    syntax: "!link",
    category: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var embed = new Discord.MessageEmbed()
            .setTitle("Social e Contatti")
            .setDescription("Tutti i link a social e contatti di **Giulio**")
            .addField("<:gmail:927643148899991552> Email", "giuliopaesani@gmail.com")
            .addField("<:instagram:927640217320579152> Instagram", "[giulio_paesani](https://www.instagram.com/giulio_paesani)")
            .addField("<:youtube:927640216502677635> Youtube - Personale e Intrattenimento", "[Giulio](https://www.youtube.com/channel/UCvIafNR8ZvZyE5jVGVqgVfA)")
            .addField("<:youtube:927640216502677635> Youtube - Programmazione", "[GiulioAndCode](https://www.youtube.com/c/giulioandcode)")
            .addField("<:tiktok:927640216813068428> TikTok", "[giulio.paesani](https://www.tiktok.com/@giulio.paesani)")
            .addField("<:telegram:927643356090204184> Telegram", "[giulio_paesani](https://telegram.me/giulio_paesani)")
            .addField("<:discord:927643636043247698> Discord", "[GiulioAndCommunity](https://discord.com/invite/ypTCaveew2)")
            .addField("<:github:927643636051628112> GitHub", "[GiulioPaesani](https://github.com/GiulioPaesani)")

        message.channel.send({ embeds: [embed] })
            .catch(() => { })
    },
};