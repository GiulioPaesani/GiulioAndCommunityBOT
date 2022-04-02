module.exports = {
    name: "code",
    aliases: [],
    onlyStaff: false,
    availableOnDM: true,
    description: "Ottenere codici o info per bot discord.js",
    syntax: "!code (code)",
    category: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var command = args.join(" ").toLowerCase()

        if (args[args.length - 1] == "here" && (utenteMod(message.author) || (message.member?.roles.cache.has(settings.idRuoloAiutante) || message.member?.roles.cache.has(settings.idRuoloAiutanteInProva))) && args.length != 1)
            command = command.slice(0, -5)

        if (utenteMod(message.author) || (message.member?.roles.cache.has(settings.idRuoloAiutante) || message.member?.roles.cache.has(settings.idRuoloAiutanteInProva))) {
            var utente = message.mentions.users?.first()
            if (utente) {
                command = command.slice(0, -22).trim()
                if (utente.bot) {
                    return botCommandMessage(message, "Warning", "Non a un bot", "Non puoi mandare un codice a un bot")
                }
            }
            if (!utente)
                var utente = message.author
        }
        else
            var utente = message.author

        if (message.content == "!code") {
            var embed = new Discord.MessageEmbed()
                .setTitle(":desktop: Commands CODE :desktop:")
                .setDescription("Tutti i **codici**/**funzioni**/**tutorial** per migliorare il tuo **bot Discord**\rEcco tutte le sezioni disponibili, selezionane una, poi scegli il comando e usa `!code [id]`")
                .addField("Categorie", `
I comandi sono divisi nelle seguenti categorie:
:toolbox: Utility
:hammer: Moderazione
:ferris_wheel: Altri comandi
:rofl: Fun
:file_folder: Gestione messaggi/canali/ruoli/utenti
:no_entry_sign: Errori comuni

_Seleziona la categoria dal menù qua sotto_`)

            var select = new Discord.MessageSelectMenu()
                .setCustomId(`codeMenu,${message.author.id}`)
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

            message.channel.send({ embeds: [embed], components: [row] })
                .catch(() => { })
            return
        }

        if (!client.codes.has(command) && !client.codes.find(cmd => (cmd.aliases && cmd.aliases.includes(command.toLowerCase()) || cmd.name.toLowerCase() == command.toLowerCase()))) {
            return botCommandMessage(message, "Error", "Codice non valido", "Hai inserito un codice non esistente o non valido", property)
        }

        var codice = client.codes.get(command) || client.codes.find(cmd => (cmd.aliases && cmd.aliases.includes(command.toLowerCase()) || cmd.name.toLowerCase() == command.toLowerCase()));

        var embed = new Discord.MessageEmbed()
            .setTitle(`${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""} ${codice.name.toUpperCase()} ${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""}`)
            .setDescription(codice.description + "\r_Version: `Discord.js v13`_")
            .setFooter("Seleziona la versione di Discord.js con i bottoni qua sotto")

        if (codice.video)
            embed
                .addField(":video_camera: Video", `Guarda il video su YouTube di Giulio per maggiori info ([Clicca qui](${codice.video}))`)

        if (codice.info)
            embed.addField(":name_badge: Info - Leggere attentamente", codice.info)

        var button1 = new Discord.MessageButton()
            .setLabel("v12")
            .setCustomId(`codeSwitch,${message.author.id},${codice.id},12`)
            .setStyle("SECONDARY")

        var button2 = new Discord.MessageButton()
            .setLabel("v13")
            .setCustomId(`codeSwitch,${message.author.id},${codice.id},13`)
            .setStyle("PRIMARY")

        var button3 = new Discord.MessageButton()
            .setLabel("Ottieni codice completo")
            .setCustomId(`codeCompleto,${message.author.id},${codice.id},13`)
            .setStyle("SUCCESS")

        var row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        var codeText = ""
        var codeSplit = codice.v13.trim().split("\n")
        var tooLong = false

        codeSplit.forEach(row => {
            if ((codeText + row + 2).length > 1014)
                tooLong = true
            else if (!tooLong)
                codeText += row + "\r"
        })

        embed
            .addField(":wrench: Code:", "```js\r" + codeText + "```")

        if (tooLong) {
            embed.addField(":warning: Il codice è troppo lungo", "Ottieni il codice completo con il pulsante **\"Ottieni codice completo\"**")
            row.addComponents(button3)
        }

        if (args[args.length - 1].toLowerCase() == "here") {
            message.channel.send({ embeds: [embed], components: [row] })
                .then(msg => {
                    setTimeout(() => msg.delete(), 60000)
                })
                .catch(() => { })
        }
        else {
            utente.send({ embeds: [embed], components: [row] })
                .then(() => {
                    if (message.channel.type != "DM")
                        botCommandMessage(message, "Correct", "Ecco il codice", `Il codice di **${codice.name.toUpperCase()}** è stato mandato in privato a ${utente.toString()} `)
                })
                .catch(() => {
                    return botCommandMessage(message, "Warning", "DM non aperti", `Questo utente non può ricevere messaggi privati`)
                })
        }
    },
};