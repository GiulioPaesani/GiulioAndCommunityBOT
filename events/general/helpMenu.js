module.exports = {
    name: `clickMenu`,
    async execute(menu) {
        if (!menu.id.startsWith("helpMenu")) return

        if (isMaintenance(menu.clicker.user.id)) return

        if (menu.id.split(",")[1] != menu.clicker.user.id) return menu.reply.defer()

        menu.reply.defer()

        let option1 = new disbut.MessageMenuOption()
            .setLabel('General')
            .setEmoji('🎡')
            .setValue('helpGeneral')
            .setDescription('!test, !help, !github, !youtube...')
        let option2 = new disbut.MessageMenuOption()
            .setLabel('Community')
            .setEmoji('💡')
            .setValue('helpCommunity')
            .setDescription('!suggest, !tclose, !tadd...')
        let option3 = new disbut.MessageMenuOption()
            .setLabel('Statistics')
            .setEmoji('📊')
            .setValue('helpStatistics')
            .setDescription('!userstats, !avatar, !channelinfo...')
        let option4 = new disbut.MessageMenuOption()
            .setLabel('Fun')
            .setEmoji('😂')
            .setValue('helpFun')
            .setDescription('!say, !cuser, !cserver...')
        let option5 = new disbut.MessageMenuOption()
            .setLabel('Ranking')
            .setEmoji('💵')
            .setValue('helpRanking')
            .setDescription('!rank, !lb...')
        let option6 = new disbut.MessageMenuOption()
            .setLabel('Moderation')
            .setEmoji('👮')
            .setValue('helpModeration')
            .setDescription('!kick, !mute, !infractions, !warn...')
        let option7 = new disbut.MessageMenuOption()
            .setLabel('Private rooms')
            .setEmoji('🔐')
            .setValue('helpPrivateRooms')
            .setDescription('!pclose, !padd, !premove, !prename...')

        let select = new disbut.MessageMenu()
            .setID(`helpMenu,${menu.clicker.user.id}`)
            .setPlaceholder('Select category...')
            .setMaxValues(1)
            .setMinValues(1)
            .addOption(option1)
            .addOption(option2)
            .addOption(option3)
            .addOption(option4)
            .addOption(option5)
            .addOption(option6)
            .addOption(option7)

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

        var commands = client.commands.array().filter(x => x.category == category)

        if (!utenteMod(menu.clicker.user))
            commands = commands.filter(x => !x.onlyStaff)

        commands.forEach(command => {
            embed
                .addField(`${command.syntax} ${command.availableOnDM ? "<:DmTag:905795088171540500>" : ""}${command.onlyStaff ? "<:AdminTag:905795087903109171>" : ""}`, `
${command.description}
${command.aliases.length > 0 ? `_Alias: \`${command.aliases.join("` `")}\`_` : ``}
`)
        });

        menu.message.edit(embed, select)
    },
};