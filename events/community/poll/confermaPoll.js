const Discord = require("discord.js")
const moment = require("moment")
const fetch = require("node-fetch");
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("confermaPoll")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let embed = new Discord.MessageEmbed()
            .setTitle("📊 Sondaggio creato 📊")
            .setColor(colors.green)
            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
            .setDescription(`Il tuo sondaggio è stato creato e pubblicato in <#${interaction.message.channel.id != settings.idCanaliServer.staffPolls ? settings.idCanaliServer.polls : settings.idCanaliServer.staffPolls}>`)
            .addField(interaction.message.embeds[0].fields[0].name, interaction.message.embeds[0].fields[0].value)

        interaction.message.edit({ embeds: [embed], components: [], fetchReply: true })
            .then(msg => {
                if (interaction.message.channel.id == settings.idCanaliServer.staffPolls) {
                    setTimeout(() => msg.delete(), 1000 * 10)
                }
            })

        let timeout = parseInt(interaction.customId.split(",")[2])

        let embed2 = new Discord.MessageEmbed()
            .setAuthor({ name: (interaction.member.nickname || interaction.user.username), iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            .setTitle(`${interaction.customId.split(",")[3] == "ufficiale" ? "[OFFICIAL POLL]" : ""} ${interaction.message.embeds[0].fields[0].name}`)
            .addField("\u200b", interaction.message.embeds[0].fields[0].value.split("\n\n")[interaction.message.embeds[0].fields[0].value.split("\n\n").length == 1 ? 0 : 1].split("\n").map(x => x += ": **0** - 0%").join("\n"))
            .setFooter({ text: `Poll close on ${interaction.message.channel.id != settings.idCanaliServer.staffPolls ? moment().add(timeout, "ms").format("DD MMM HH:mm") : ""}` })

        if (interaction.message.embeds[0].fields[0].value.split("\n\n").length > 1)
            embed2.setDescription(interaction.message.embeds[0].fields[0].value.split("\n\n")[0])

        if (interaction.customId.split(",")[3] == "ufficiale") embed2.setColor(colors.purple)

        let discordEmoji = await fetch("https://gist.githubusercontent.com/rigwild/1b509bf69e2a2391f44aa5de3f05b006/raw/e4b5bfa81ea3e7e51af1f5585964666115934631/discord_emojis.json")
        discordEmoji = await discordEmoji.json();

        client.channels.cache.get(interaction.message.channel.id != settings.idCanaliServer.staffPolls ? settings.idCanaliServer.polls : settings.idCanaliServer.staffPolls).send({ embeds: [embed2], fetchReply: true })
            .then(msg => {
                interaction.message.embeds[0].fields[0].value.split("\n\n")[interaction.message.embeds[0].fields[0].value.split("\n\n").length == 1 ? 0 : 1].split("\n").map(x => x.split(" ")[0]).forEach(reaction => {
                    msg.react(discordEmoji[reaction] || reaction)
                });
            })

    },
};
