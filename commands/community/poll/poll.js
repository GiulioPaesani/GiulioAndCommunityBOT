const Discord = require("discord.js");
const moment = require("moment");
const Grapheme = require('grapheme-splitter');
const splitter = new Grapheme();
const settings = require("../../../config/general/settings.json")
const colors = require("../../../config/general/colors.json");
const { replyMessage } = require("../../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");
const { getUser } = require("../../../functions/database/getUser");
const { addUser } = require("../../../functions/database/addUser");
const { hasSufficientLevels } = require("../../../functions/leveling/hasSufficientLevels");

module.exports = {
    name: "poll",
    description: "Creare un sondaggio dove i membri possono votare",
    permissionLevel: 0,
    requiredLevel: 10,
    cooldown: 30,
    syntax: "/poll [domanda] (description) [opzioni] (emoji) (timeout)",
    category: "community",
    data: {
        options: [
            {
                name: "domanda",
                description: "Domanda del sondaggio",
                type: "STRING",
                required: true
            },
            {
                name: "opzioni",
                description: "Le opzioni del sondaggio, separate da una virgola",
                type: "STRING",
                required: true
            },
            {
                name: "emoji",
                description: "Emoji di tutte le opzioni, separate da una virgola",
                type: "STRING",
                required: false
            },
            {
                name: "description",
                description: "Descrizione del sondaggio",
                type: "STRING",
                required: false
            },
            {
                name: "timeout",
                description: "Tempo dopo la quale un sondaggio viene terminato e poi eliminato",
                type: "STRING",
                required: false,
                choices: [
                    {
                        name: "5 minuti",
                        value: "300000"
                    },
                    {
                        name: "1 ora",
                        value: "3600000"
                    },
                    {
                        name: "5 ore",
                        value: "18000000"
                    },
                    {
                        name: "[Default] 1 giorno",
                        value: "86400000"
                    },
                    {
                        name: "[Only LEVEL 20] 1 settimana",
                        value: "604800000"
                    },
                    {
                        name: "[Only LEVEL 60] 4 settimane",
                        value: "2419200000"
                    }
                ]
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let domanda = interaction.options.getString("domanda")
        let description = interaction.options.getString("description")
        let opzioni = interaction.options.getString("opzioni").split(",").map(x => x.trim()).filter(x => x)
        let emoji = []
        let timeout = parseInt(interaction.options.getString("timeout")) || 86400000

        if (domanda.length > 256) {
            return replyMessage(client, interaction, "Warning", "Domanda troppo lunga", "Puoi scrivere una domanda solo fino a 256 caratteri", comando)
        }

        if (description && description.length > 300) {
            return replyMessage(client, interaction, "Warning", "Descrizione troppo lunga", "Puoi scrivere una descrizione solo fino a 300 caratteri", comando)
        }

        if (opzioni.length < 2) {
            return replyMessage(client, interaction, "Warning", "Poche opzioni", "Devi inserire almeno due opzioni al sondaggio", comando)
        }
        if (opzioni.length > 5) {
            return replyMessage(client, interaction, "Warning", "Troppe opzioni", "Puoi inserire massimo 5 opzioni al sondaggio", comando)
        }
        if (opzioni.some(x => x.length > 150)) {
            return replyMessage(client, interaction, "Warning", "Opzione troppo lunga", "Una o più opzioni che hai inserito supera i 150 caratteri massimi", comando)
        }

        let userstats = await getUser(interaction.user.id)
        if (!userstats) userstats = await addUser(interaction.member)

        if (getUserPermissionLevel(client, interaction.user.id) <= 1 && timeout == 604800000 && !hasSufficientLevels(client, userstats, 20)) {

            return replyMessage(client, interaction, "InsufficientLevel", "", `Devi avere almeno il ${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == "Level 20").toString()} o **boostare** il server per creare un sondaggio lungo una settimana`, comando)
        }

        if (getUserPermissionLevel(client, interaction.user.id) <= 1 && timeout == 2419200000 && !hasSufficientLevels(client, userstats, 60)) {
            return replyMessage(client, interaction, "InsufficientLevel", "", `Devi avere almeno il ${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == "Level 60").toString()} per creare un sondaggio lungo 4 settimane`, comando)
        }

        timeout = parseInt(timeout)

        let i = 0;
        if (interaction.options.getString("emoji")) {
            interaction.options.getString("emoji").split(",").map(x => x.trim()).forEach(x => {
                let isValid = false
                if (x.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g)) {
                    isValid = true
                    if (splitter.splitGraphemes(x).length > 1) {
                        return replyMessage(client, interaction, "Warning", "Non più emoji", `Per ogni opzione devi specificare una singola emoji`, comando)
                    }
                }
                else {
                    if (x.split("").filter(y => y == ":").length > 2) {
                        return replyMessage(client, interaction, "Warning", "Non più emoji", `Per ogni opzione devi specificare una singola emoji`, comando)
                    }

                    client.emojis.cache.forEach(y => {
                        if (`<${y.animated ? "a" : ""}:${y.name}:${y.id}>` == x) isValid = true
                    })
                }

                if (isValid) emoji.push(x)
                else emoji.push(i == 0 ? ":one:" : i == 1 ? ":two:" : i == 2 ? ":three:" : i == 3 ? ":four:" : ":five:")
                i++
            })
        }

        if (emoji.some(x => emoji.filter(y => y == x).length > 1)) {
            return replyMessage(client, interaction, "Warning", "Non emoji uguali", `Per ogni opzione è necessario inserire un emoji differente, non è possibile inserire più possibilità con la stessa emoji`, comando)
        }

        emoji = emoji.slice(0, 5)
        let pollText = ""
        for (let i = 0; i < 5; i++) {
            if (opzioni[i]) {
                pollText += `${emoji[i] ? emoji[i] : i == 0 ? ":one:" : i == 1 ? ":two:" : i == 2 ? ":three:" : i == 3 ? ":four:" : ":five:"} ${opzioni[i]}\n`
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Confermi il tuo sondaggio?")
            .setColor(colors.yellow)
            .setDescription(`**Confermi** il tuo sondaggio? Una volta accettato verrà pubblicato nel canale <#${settings.idCanaliServer.polls}>`)
            .addField(domanda, (description || "") + "\n\n" + pollText)
            .setFooter({ text: `Poll close on ${moment().add(timeout, "ms").format("DD MMM HH:mm")}` })

        let button1 = new Discord.MessageButton()
            .setLabel("Annulla")
            .setStyle("DANGER")
            .setCustomId(`annullaPoll,${interaction.user.id}`)

        let button2 = new Discord.MessageButton()
            .setLabel("Conferma")
            .setStyle("SUCCESS")
            .setCustomId(`confermaPoll,${interaction.user.id},${timeout}`)

        let button3 = new Discord.MessageButton()
            .setLabel("Conferma come UFFICIALE")
            .setStyle("SUCCESS")
            .setCustomId(`confermaPoll,${interaction.user.id},${timeout},ufficiale`)

        let button4 = new Discord.MessageButton()
            .setLabel("Conferma come STAFF POLL")
            .setStyle("SUCCESS")
            .setCustomId(`confermaPoll,${interaction.user.id},${timeout},staffpoll`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        let row2 = new Discord.MessageActionRow()

        if (getUserPermissionLevel(client, interaction.user.id) == 3) {
            row2.addComponents(button3)
        }
        if (getUserPermissionLevel(client, interaction.user.id) >= 1) {
            row2.addComponents(button4)
        }

        interaction.reply({ embeds: [embed], components: getUserPermissionLevel(client, interaction.user.id) >= 1 ? [row, row2] : [row] })
    },
};