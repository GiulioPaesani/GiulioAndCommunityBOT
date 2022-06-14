const Discord = require("discord.js");
const { getEmoji } = require("../../../functions/general/getEmoji");
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isSelectMenu()) return
        if (!interaction.customId.startsWith("codeMenu")) return

        if (isMaintenance(interaction.user.id)) return

        interaction.deferUpdate()

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Menu non tuo", "Questo menu è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let select = new Discord.MessageSelectMenu()
            .setCustomId(`codeMenu,${interaction.user.id}`)
            .setPlaceholder('Select category...')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions({
                label: "Utility",
                emoji: "🧰",
                value: "codeUtility",
            })
            .addOptions({
                label: "Moderation",
                emoji: "🔨",
                value: "codeModeration",
            })
            .addOptions({
                label: "Altri comandi",
                emoji: "🎡",
                value: "codeCommands",
            })
            .addOptions({
                label: "Fun",
                emoji: "🤣",
                value: "codeFun",
            })
            .addOptions({
                label: "Gestione messaggi/canali/ruoli/utenti",
                emoji: "📁",
                value: "codeManage",
            })
            .addOptions({
                label: "Errori comuni",
                emoji: "🚫",
                value: "codeErrors",
            })

        let row = new Discord.MessageActionRow()
            .addComponents(select)

        let category;
        let embed = new Discord.MessageEmbed()
            .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il command `/code [id]`")

        switch (interaction.values[0]) {
            case "codeUtility": {
                category = "utility"
                embed
                    .setTitle("🧰 UTILITY codes 🧰")
                    .setColor("#CA253B")
            } break
            case "codeModeration": {
                category = "moderation"
                embed
                    .setTitle("🔨 MODERATION codes 🔨")
                    .setColor("#5E666A")
            } break
            case "codeCommands": {
                category = "commands"
                embed
                    .setTitle("🎡 COMMANDS codes 🎡")
                    .setColor("#A98ED0")
            } break
            case "codeFun": {
                category = "fun"
                embed
                    .setTitle("😂 FUN codes 😂")
                    .setColor("#F0C048")
            } break
            case "codeManage": {
                category = "manage"
                embed
                    .setTitle("📁 MANAGING codes 📁")
                    .setColor("#53A9E9")
            } break
            case "codeErrors": {
                category = "errors"
                embed
                    .setTitle("🚫 ERRORS codes 🚫")
                    .setColor("#B82E40")
            } break
        }

        let row2 = new Discord.MessageActionRow()
        let codes = [...client.codes.filter(x => x.category == category).map(x => x)]

        let totPage = Math.ceil(codes.length / 5)
        let page = 1

        for (let i = 5 * (page - 1); i < 5 * page; i++) {
            if (codes[i]) {
                embed
                    .addField(`${codes[i].name}`, `
${codes[i].description}
`, false)
            }
        }

        let button1 = new Discord.MessageButton()
            .setCustomId(`indietroCode,${interaction.user.id},${page},${category}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous"))

        if (page == 1) {
            button1.setDisabled()
        }

        let button2 = new Discord.MessageButton()
            .setCustomId(`avantiCode,${interaction.user.id},${page},${category}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next"))

        if (page == totPage) {
            button2.setDisabled()
        }

        row2
            .addComponents(button1)
            .addComponents(button2)

        if (totPage > 1)
            embed.setFooter({ text: `Page ${page}/${totPage}` })

        interaction.message.edit({ embeds: [embed], components: totPage > 1 ? [row2, row] : [row] })
    },
};