module.exports = {
    name: `clickMenu`,
    async execute(menu) {
        if (!menu.id.startsWith("codeMenu")) return
       
        if (isMaintenance(menu.clicker.user.id)) return

        if (menu.id.split(",")[1] != menu.clicker.user.id) return menu.reply.defer()

        menu.reply.defer()

        var option1 = new disbut.MessageMenuOption()
            .setLabel('Utility')
            .setEmoji('🧰')
            .setValue('codeUtility')

        var option2 = new disbut.MessageMenuOption()
            .setLabel('Moderation')
            .setEmoji('🔨')
            .setValue('codeModeration')

        var option3 = new disbut.MessageMenuOption()
            .setLabel('Altri comandi')
            .setEmoji('🎡')
            .setValue('codeCommands')

        var option4 = new disbut.MessageMenuOption()
            .setLabel('Fun')
            .setEmoji('🤣')
            .setValue('codeFun')

        var option5 = new disbut.MessageMenuOption()
            .setLabel('Gestione messaggi/canali/ruoli/utenti')
            .setEmoji('📁')
            .setValue('codeManage')

        var option6 = new disbut.MessageMenuOption()
            .setLabel('Errori comuni')
            .setEmoji('🚫')
            .setValue('codeErrors')

        var select = new disbut.MessageMenu()
            .setID(`codeMenu,${menu.clicker.user.id}`)
            .setPlaceholder('Select category...')
            .setMaxValues(1)
            .setMinValues(1)
            .addOption(option1)
            .addOption(option2)
            .addOption(option3)
            .addOption(option4)
            .addOption(option5)
            .addOption(option6)

        var category;
        var embed = new Discord.MessageEmbed()
            .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il command `!code [id]`")

        switch (menu.values[0]) {
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

        var codes = client.codes.array().filter(x => x.category == category)
        codes.forEach(code => {
            embed
                .addField(`${code.name}`, `
${code.description}
_IDs: \`${[code.name.toLowerCase()].concat(code.aliases).join("` `")}\`_
`)
        });

        menu.message.edit(embed, select)
    },
};