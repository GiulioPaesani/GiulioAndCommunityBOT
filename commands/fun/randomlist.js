const Discord = require('discord.js');
const settings = require("../../config/general/settings.json")
const { getEmoji } = require("../../functions/general/getEmoji")
const { isMaintenance } = require("../../functions/general/isMaintenance");
const { replyMessage } = require('../../functions/general/replyMessage');

module.exports = {
    name: "randomlist",
    description: "Estrai un valore random tra quelli inseriti in lista",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/randomlist [values] (num)",
    category: "fun",
    data: {
        options: [
            {
                name: "values",
                description: "Elenco di valori possibili da estrarre, separati da una virgola",
                type: "STRING",
                required: true,
            },
            {
                name: "num",
                description: "Numero di valori da estrarre dalla lista",
                type: "INTEGER",
                required: false,
                minValue: 1
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let values = interaction.options.getString("values").split(",").map(x => x.trim())
        let num = interaction.options.getInteger("num") || 1

        let random = []
        for (let i = 0; i < num; i++) {
            if (values.length > 0) {
                random.push(values[Math.floor(Math.random() * values.length)])
                values.splice(values.findIndex(x => x == random[random.length - 1]), 1);
            }
        }

        let randomList = ""

        let totPage = Math.ceil(random.length / 10)
        let page = 1;

        for (let i = 10 * (page - 1); i < 10 * page; i++) {
            if (random[i]) {
                randomList += `**#${i + 1}** ${random[i]}\n`
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Random ${num} values from list`)
            .setColor("#EA596E")
            .setDescription(`:game_die: Lista generata:\n${randomList}`)
            .setFooter({ text: totPage > 1 ? `Page ${page}/${totPage}` : "" })

        let button1 = new Discord.MessageButton()
            .setCustomId(`indietroRandomList`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous"))

        if (page == 1) {
            button1.setDisabled()
        }

        let button2 = new Discord.MessageButton()
            .setCustomId(`avantiRandomList`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next"))

        let button3 = new Discord.MessageButton()
            .setLabel("Rigenera")
            .setStyle("PRIMARY")
            .setCustomId(`randomlist`)

        let row = new Discord.MessageActionRow()

        if (totPage > 1) {
            row
                .addComponents(button1)
                .addComponents(button2)
        }

        row.addComponents(button3)

        interaction.reply({ embeds: [embed], components: [row], fetchReply: true })
            .then(async msg => {
                const collector = msg.createMessageComponentCollector();

                collector.on('collect', async i => {
                    if (!i.isButton()) return
                    const maintenanceStates = await isMaintenance(i.user.id)
                    if (maintenanceStates) return

                    i.deferUpdate().catch(() => { })

                    if (i.user.id != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

                    if (i.customId == "indietroRandomList") {
                        page--
                        if (page < 1) page = 1
                    }
                    if (i.customId == "avantiRandomList") {
                        page++
                        if (page > totPage) page = totPage
                    }
                    if (i.customId == "randomlist") {
                        page = 1
                        random = []
                        values = interaction.options.getString("values").split(",").map(x => x.trim())
                        for (let i = 0; i < num; i++) {
                            if (values.length > 0) {
                                random.push(values[Math.floor(Math.random() * values.length)])
                                values.splice(values.findIndex(x => x == random[random.length - 1]), 1);
                            }
                        }
                    }

                    queueList = ""

                    totPage = Math.ceil(random.length / 10)
                    randomList = ""

                    for (let i = 10 * (page - 1); i < 10 * page; i++) {
                        if (random[i]) {
                            randomList += `**#${i + 1}** ${random[i]}\n`
                        }
                    }

                    let embed = new Discord.MessageEmbed()
                        .setTitle(`Random ${num} values from list`)
                        .setColor("#EA596E")
                        .setDescription(`:game_die: Lista generata:\n${randomList}`)
                        .setFooter({ text: totPage > 1 ? `Page ${page}/${totPage}` : "" })

                    let button1 = new Discord.MessageButton()
                        .setCustomId(`indietroRandomList`)
                        .setStyle("PRIMARY")
                        .setEmoji(getEmoji(client, "Previous"))

                    if (page == 1) {
                        button1.setDisabled()
                    }

                    let button2 = new Discord.MessageButton()
                        .setCustomId(`avantiRandomList`)
                        .setStyle("PRIMARY")
                        .setEmoji(getEmoji(client, "Next"))

                    let button3 = new Discord.MessageButton()
                        .setLabel("Rigenera")
                        .setStyle("PRIMARY")
                        .setCustomId(`randomlist`)

                    let row = new Discord.MessageActionRow()

                    if (totPage > 1) {
                        row
                            .addComponents(button1)
                            .addComponents(button2)
                    }

                    row.addComponents(button3)

                    msg.edit({ embeds: [embed], components: [row] })
                })
            })
    },
};