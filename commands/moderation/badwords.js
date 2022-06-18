const Discord = require('discord.js');
const settings = require('../../config/general/settings.json');
const badwords = require('../../config/moderation/badwords.json');
const { getEmoji } = require('../../functions/general/getEmoji');

module.exports = {
    name: "badwords",
    description: "Lista completa di tutte le parole, espressioni o frasi proibite",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 30,
    syntax: "/badwords",
    category: "moderation",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let badwordsList = ""

        let totPage = Math.ceil(badwords.length / 20)
        let page = 1;

        for (let i = 20 * (page - 1); i < 20 * page; i++) {
            if (badwords[i]) {
                badwordsList += `${badwords[i]}\n`
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(":zipper_mouth: Badwords")
            .setDescription(`Lista completa di tutte le espressioni proibite nel server
Trovi l'elenco completo anche [QUI](https://github.com/GiulioPaesani/GiulioAndCommunityBOT/blob/main/config/moderation/badwords.json)
            
:warning: _Se siete sensibili o deboli di cuore evitate di vedere questa lista_`)
            .addField("\u200b", `||${badwordsList}||`)
            .setFooter({ text: `Page ${page}/${totPage}` })

        let button1 = new Discord.MessageButton()
            .setCustomId(`indietroBadwords,${interaction.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous"))

        if (page == 1) {
            button1.setDisabled()
        }

        let button2 = new Discord.MessageButton()
            .setCustomId(`avantiBadwords,${interaction.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next"))

        if (page == totPage) {
            button2.setDisabled()
        }

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.reply({ embeds: [embed], components: [row], fetchReply: true })
            .then(msg => {
                setTimeout(() => msg.delete(), 1000 * 60)
            })
    },
};