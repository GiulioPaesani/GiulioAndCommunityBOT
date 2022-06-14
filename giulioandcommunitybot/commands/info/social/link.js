const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const { getEmoji } = require("../../../functions/general/getEmoji")

module.exports = {
    name: "link",
    description: "Tutti i social e contatti di Giulio",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/link",
    category: "info",
    client: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let embed = new Discord.MessageEmbed()
            .setTitle("Social e Contatti")
            .setDescription("Link di social e contatti principali di **Giulio**\n_Vedi altro su [giuliopaesani.it/links](https://www.giuliopaesani.it/links)_")
            .setColor("#546A7B")
            .addField(`${getEmoji(client, "Email")} Email`, "giuliopaesani@gmail.com - giulioandcode@gmail.com")
            .addField(`${getEmoji(client, "Instagram")} Instagram`, "[giulio_paesani](https://www.instagram.com/giulio_paesani)")
            .addField(`${getEmoji(client, "YouTube")} Youtube`, "[Giulio](https://www.youtube.com/channel/UCvIafNR8ZvZyE5jVGVqgVfA) - [GiulioAndCode](https://www.youtube.com/c/giulioandcode)")
            .addField(`${getEmoji(client, "TikTok")} TikTok`, "[giulio.paesani](https://www.tiktok.com/@giulio.paesani)")
            .addField(`${getEmoji(client, "Telegram")} Telegram`, "[giulio_paesani](https://telegram.me/giulio_paesani)")
            .addField(`${getEmoji(client, "Discord")} Discord`, "GiulioAndCode#4272 - [GiulioAndCommunity](https://discord.com/invite/ypTCaveew2)")
            .addField(`${getEmoji(client, "GitHub")} GitHub`, "[GiulioPaesani](https://github.com/GiulioPaesani)")

        interaction.reply({ embeds: [embed] })
    },
};