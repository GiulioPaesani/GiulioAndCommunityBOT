module.exports = {
    name: `interactionCreate`,
    async execute(menu) {
        if (!menu.isSelectMenu()) return
        if (!menu.customId.startsWith("helpMenu")) return

        if (isMaintenance(menu.user.id)) return

        if (menu.customId.split(",")[1] != menu.user.id) return menu.deferUpdate()

        menu.deferUpdate()

        var select = new Discord.MessageSelectMenu()
            .setCustomId(`helpMenu,${menu.user.id}`)
            .setPlaceholder('Select category...')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions({
                label: "General",
                emoji: "🎡",
                value: "helpGeneral",
                description: "!test, !help, !github, !youtube..."
            })
            .addOptions({
                label: "Community",
                emoji: "💡",
                value: "helpCommunity",
                description: "!suggest, !tclose, !tadd..."
            })
            .addOptions({
                label: "Statistics",
                emoji: "📊",
                value: "helpStatistics",
                description: "!userstats, !avatar, !channelinfo..."
            })
            .addOptions({
                label: "Fun",
                emoji: "😂",
                value: "helpFun",
                description: "!say, !cuser, !cserver..."
            })
            .addOptions({
                label: "Ranking",
                emoji: "💵",
                value: "helpRanking",
                description: "!rank, !lb..."
            })
            .addOptions({
                label: "Moderation",
                emoji: "👮",
                value: "helpModeration",
                description: "!kick, !mute, !infractions, !warn..."
            })
            .addOptions({
                label: "Private rooms",
                emoji: "🔐",
                value: "helpPrivateRooms",
                description: "!pclose, !padd, !premove, !prename..."
            })

        var row = new Discord.MessageActionRow()
            .addComponents(select)

        var category;
        var embed = new Discord.MessageEmbed()

        switch (menu.values[0]) {
            case "helpGeneral": {
                category = "general"
                embed
                    .setTitle("🎡 GENERAL commands 🎡")
                    .setColor("#A98ED0")
                    .setDescription("Comandi generali, specifi del server")
            } break
            case "helpCommunity": {
                category = "community"
                embed
                    .setTitle("💡 COMMUNITY commands 💡")
                    .setColor("#EECB7A")
                    .setDescription("Comandi della community, come ticket e suggerimenti")
            } break
            case "helpStatistics": {
                category = "statistics"
                embed
                    .setTitle("📊 STATISTICS commands 📊")
                    .setColor("#CFD6DB")
                    .setDescription("Comandi per avere statistiche di utenti, canali, ruoli o altro")
            } break
            case "helpFun": {
                category = "fun"
                embed
                    .setTitle("😂 FUN commands 😂")
                    .setColor("#F0C048")
                    .setDescription("Comandi fun, di divertimento e di minigames")
            } break
            case "helpRanking": {
                category = "ranking"
                embed
                    .setTitle("💵 RANKING commands 💵")
                    .setColor("#75AE53")
                    .setDescription("Comandi relativi al livellamento")
            } break
            case "helpModeration": {
                category = "moderation"
                embed
                    .setTitle("👮 MODERATION commands 👮")
                    .setColor("#2A6797")
                    .setDescription("Comandi di moderazione per lo staff")
            } break
            case "helpPrivateRooms": {
                category = "privateRooms"
                embed
                    .setTitle("🔐 PRIVATE ROOMS commands 🔐")
                    .setColor("#FBA932")
                    .setDescription("Comandi relativi alle stanze private")
            } break
        }

        var commands = client.commands.filter(x => x.category == category)

        if (!utenteMod(menu.user))
            commands = commands.filter(x => !x.onlyStaff)

        commands.forEach(command => {
            embed
                .addField(`${command.syntax} ${command.availableOnDM ? "<:DmTag:905795088171540500>" : ""}${command.onlyStaff ? "<:AdminTag:905795087903109171>" : ""}`, `
${command.description}
${command.aliases.length > 0 ? `_Alias: \`${command.aliases.join("` `")}\`_` : ``}
`)
        });

        menu.message.edit({ embeds: [embed], components: [row] })
    },
};