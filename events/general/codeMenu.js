module.exports = {
    name: `interactionCreate`,
    async execute(menu) {
        if (!menu.isSelectMenu()) return
        if (!menu.customId.startsWith("codeMenu")) return

        if (isMaintenance(menu.user.id)) return

        if (menu.customId.split(",")[1] != menu.user.id) return menu.deferUpdate()

        menu.deferUpdate()

        var select = new Discord.MessageSelectMenu()
            .setCustomId(`codeMenu,${menu.user.id}`)
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

        var row = new Discord.MessageActionRow()
            .addComponents(select)

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

        var codes = client.codes.filter(x => x.category == category)
        codes.forEach(code => {
            embed
                .addField(`${code.name}`, `
${code.description}
_IDs: \`${[code.name.toLowerCase()].concat(code.aliases).join("` `")}\`_
`)
        });

        menu.message.edit({ embeds: [embed], components: [row] })
    },
};