const Discord = require("discord.js")
const fetch = require("node-fetch")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { getEmoji } = require("../../../functions/general/getEmoji");
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isSelectMenu()) return
        if (!interaction.customId.startsWith("helpMenu")) return

        if (isMaintenance(interaction.user.id)) return

        interaction.deferUpdate()

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let category = interaction.values[0]
        let embed = new Discord.MessageEmbed()

        switch (category) {
            case "general": {
                embed
                    .setTitle("🎡 GENERAL commands 🎡")
                    .setColor("#A0ADB7")
            } break
            case "community": {
                embed
                    .setTitle("💡 COMMUNITY commands 💡")
                    .setColor("#F6D17E")
            } break
            case "info": {
                embed
                    .setTitle("📊 INFORMATIONS commands 📊")
                    .setColor("#C5CED5")
            } break
            case "music": {
                embed
                    .setTitle("🎵 MUSIC commands 🎵")
                    .setColor("#58A3DE")
            } break
            case "fun": {
                embed
                    .setTitle("😂 FUN and GAMES commands 😂")
                    .setColor("#F2C249")
            } break
            case "ranking": {
                embed
                    .setTitle("💵 RANKING commands 💵")
                    .setColor("#A5D089")
            } break
            case "moderation": {
                embed
                    .setTitle("👮 MODERATION commands 👮")
                    .setColor("#2A6797")
            } break
            case "rooms": {
                embed
                    .setTitle("🔐 TICKETS and PRIVATE ROOMS commands 🔐")
                    .setColor("#FFAC33")
            } break
        }

        let row2 = new Discord.MessageActionRow()
        let funCommands = await fetch("http://localhost:5001/client", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": String(process.env.apiKey)
            }
        }).catch(() => { })

        if (funCommands) {
            funCommands = await funCommands.text()
            funCommands = JSON.parse(funCommands).commands
        }
        else funCommands = []

        let moderactionCommands = await fetch("http://localhost:5002/client", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": String(process.env.apiKey)
            }
        }).catch(() => { })

        if (moderactionCommands) {
            moderactionCommands = await moderactionCommands.text()
            moderactionCommands = JSON.parse(moderactionCommands).commands
        }
        else moderactionCommands = []

        let rankingCommands = await fetch("http://localhost:5003/client", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": String(process.env.apiKey)
            }
        }).catch(() => { })

        if (rankingCommands) {
            rankingCommands = await rankingCommands.text()
            rankingCommands = JSON.parse(rankingCommands).commands
        }
        else rankingCommands = []

        let commands = [...client.commands.filter(x => x.category == category).map(x => x), ...funCommands.filter(x => x.category == category), ...moderactionCommands.filter(x => x.category == category), ...rankingCommands.filter(x => x.category == category)]

        let totPage = Math.ceil(commands.length / 9)
        let page = 1

        for (let i = 9 * (page - 1); i < 9 * page; i++) {
            if (commands[i]) {
                embed
                    .addField(`/${commands[i].name} ${commands[i].permissionLevel == 3 ? getEmoji(client, "OwnerCommand") : commands[i].permissionLevel == 2 ? getEmoji(client, "AdminCommand") : commands[i].permissionLevel == 1 ? getEmoji(client, "ModCommand") : ""}`, `
${commands[i].description}
`, true)
            }
        }

        let button1 = new Discord.MessageButton()
            .setCustomId(`indietroHelp,${interaction.user.id},${page},${category}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous"))

        if (page == 1) {
            button1.setDisabled()
        }

        let button2 = new Discord.MessageButton()
            .setCustomId(`avantiHelp,${interaction.user.id},${page},${category}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next"))

        if (page == totPage) {
            button2.setDisabled()
        }

        row2
            .addComponents(button1)
            .addComponents(button2)

        embed
            .setFooter({ text: `Page ${page}/${totPage} - Usa /help (command) per avere più informazioni` })

        let select = new Discord.MessageSelectMenu()
            .setCustomId(`helpMenu,${interaction.user.id}`)
            .setPlaceholder('Select category...')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions({
                label: "General",
                emoji: "🎡",
                value: "general",
                description: "/help, /code, /segnala, /video, ..."
            })
            .addOptions({
                label: "Community",
                emoji: "💡",
                value: "community",
                description: "/suggest, /poll, /birthday, /question, ..."
            })
            .addOptions({
                label: "Informations",
                emoji: "📊",
                value: "info",
                description: "/serverinfo, /channelinfo, /link, /youtube, ..."
            })
            .addOptions({
                label: "Music",
                emoji: "🎵",
                value: "music",
                description: "/play, /queue, /shuffle, /lyrics, ..."
            })
            .addOptions({
                label: "Fun and Games",
                emoji: "😂",
                value: "fun",
                description: "/say, /meme, /funuser, /hack, ..."
            })
            .addOptions({
                label: "Ranking",
                emoji: "💵",
                value: "ranking",
                description: "/rank, /leaderboard, /buy, /inventory, ..."
            })
            .addOptions({
                label: "Moderation",
                emoji: "👮",
                value: "moderation",
                description: "/infractions, /ban, /tempmute, /badwords, ..."
            })
            .addOptions({
                label: "Tickets and Private rooms",
                emoji: "🔐",
                value: "rooms",
                description: "/tclose, /tadd, /pinfo, /prename, /pdelete, ..."
            })

        let row = new Discord.MessageActionRow()
            .addComponents(select)

        interaction.message.edit({ embeds: [embed], components: [row2, row] })
    },
};