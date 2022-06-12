const Discord = require("discord.js")
const settings = require("../../config/general/settings.json");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel")
const { replyMessage } = require("../../functions/general/replyMessage")

module.exports = {
    name: "code",
    description: "Ottenere codici o info per bot discord.js",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/code (codice) (user) (here)",
    category: "general",
    client: "general",
    data: {
        options: [
            {
                name: "codice",
                description: "Codice da visualizzare",
                type: "STRING",
                required: false,
                autocomplete: true
            },
            {
                name: "user",
                description: "[Only MOD] Utente a cui mandare il codice in privato",
                type: "STRING",
                required: false,
                autocomplete: true
            },
            {
                name: "here",
                description: "[Only MOD] Se inviare il codice nella chat corrente o in privato",
                type: "BOOLEAN",
                required: false
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.codingGeneral, settings.idCanaliServer.help],
    async execute(client, interaction, comando) {
        let codice = interaction.options.getString("codice")

        if (!codice) {
            let embed = new Discord.MessageEmbed()
                .setTitle(":desktop: Commands CODE :desktop:")
                .setDescription("Tutti i **codici**/**funzioni**/**tutorial** per migliorare il tuo **bot Discord**\nEcco tutte le sezioni disponibili, selezionane una, poi scegli il comando e usa `/code [codice]`")
                .addField("Categorie", `
I comandi sono divisi nelle seguenti categorie:
:toolbox: Utility
:hammer: Moderazione
:ferris_wheel: Altri comandi
:rofl: Fun
:file_folder: Gestione messaggi/canali/ruoli/utenti
:no_entry_sign: Errori comuni

_Seleziona la categoria dal menù qua sotto_

:warning: Ricorda che **copiare** non serve a nulla, quindi prendi solo spunto da questi codici e rendi tu stesso il tuo bot fantastico!`)

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

            interaction.reply({ embeds: [embed], components: [row] })
                .catch(() => { })
        }
        else {
            if (!client.codes.has(codice) && !client.codes.find(cmd => (cmd.aliases && cmd.aliases.includes(codice.toLowerCase()) || cmd.name.toLowerCase() == codice.toLowerCase()))) {
                return replyMessage(client, interaction, "Error", "Codice non valido", "Hai inserito un codice non esistente o non valido", comando)
            }

            codice = client.codes.get(codice) || client.codes.find(cmd => (cmd.aliases && cmd.aliases.includes(codice.toLowerCase()) || cmd.name.toLowerCase() == codice.toLowerCase()));

            let embed = new Discord.MessageEmbed()
                .setTitle(`${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""} ${codice.name.toUpperCase()} ${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""}`)
                .setDescription(`${codice.description}
                
Se vuoi puoi copiare direttamente tutto il codice da [QUI](${codice.link})
_Version: \`Discord.js v13\`_`)

            if (codice.video)
                embed
                    .addField(":video_camera: Video", `Guarda il video su YouTube di Giulio per maggiori info ([Clicca qui](${codice.video}))`)

            if (codice.info)
                embed.addField(":name_badge: Info - Leggere attentamente", codice.info)


            let button1 = new Discord.MessageButton()
                .setLabel("Ottieni codice completo")
                .setCustomId(`codeCompleto,${codice.id}`)
                .setStyle("SUCCESS")

            let row = new Discord.MessageActionRow()
                .addComponents(button1)

            let codeText = ""
            let codeSplit = codice.code.trim().split("\n")
            let tooLong = false

            codeSplit.forEach(row => {
                if ((codeText + row + 2).length > 1014)
                    tooLong = true
                else if (!tooLong)
                    codeText += row + "\n"
            })

            embed
                .addField(":wrench: Code:", "```js\n" + codeText + "```")

            if (tooLong) {
                embed.addField(":warning: Il codice è troppo lungo", "Ottieni il codice completo con il pulsante **\"Ottieni codice completo\"**")
            }

            let utente
            if (getUserPermissionLevel(client, interaction.user.id) >= 1) {
                if (interaction.options.getBoolean("here")) {
                    return interaction.reply({ embeds: [embed], components: tooLong ? [row] : [] })
                }
                utente = await getTaggedUser(client, interaction.options.getString("user")) || interaction.user

                if (utente.bot) {
                    return replyMessage(client, interaction, "Warning", "Non un bot", "Non puoi inviare un codice a un bot", comando)
                }
            }
            else {
                utente = interaction.user
            }

            utente.send({ embeds: [embed], components: tooLong ? [row] : [] })
                .then(() => {
                    replyMessage(client, interaction, "Correct", "Ecco il codice", `Il codice di **${codice.name.toUpperCase()}** è stato mandato in privato a ${utente.toString()}`, comando)
                })
                .catch(() => {
                    return replyMessage(client, interaction, "Warning", "DM non aperti", `Questo utente non può ricevere messaggi privati`, comando)
                })
        }
    },
};