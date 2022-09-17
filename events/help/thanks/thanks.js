const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const colors = require("../../../config/general/colors.json")
const { getAllUsers } = require("../../../functions/database/getAllUsers")
const { getEmoji } = require("../../../functions/general/getEmoji")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("thanks")) return
        if (interaction.customId.startsWith("thanksLb")) return

        await interaction.deferUpdate().catch(() => { })

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let userstatsList = await getAllUsers(client)

        let mode = interaction.customId.split(",")[2]

        let row, embed

        if (mode == "settimanale") {
            let leaderboardListThanks = userstatsList.filter(x => x.thanks).sort((a, b) => (a.thanks < b.thanks) ? 1 : ((b.thanks < a.thanks) ? -1 : 0));
            let leaderboardThanks = ""

            let totPage = Math.ceil(leaderboardListThanks.length / 10)
            let page = 1;

            for (let i = 10 * (page - 1); i < 10 * page; i++) {
                if (leaderboardListThanks[i]) {
                    switch (i) {
                        case 0:
                            leaderboardThanks += ":first_place: ";
                            break
                        case 1:
                            leaderboardThanks += ":second_place: "
                            break
                        case 2:
                            leaderboardThanks += ":third_place: "
                            break
                        default:
                            leaderboardThanks += `**#${i + 1}** `
                    }

                    let utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == leaderboardListThanks[i].id);
                    leaderboardThanks += `${utente.toString()} - **${leaderboardListThanks[i].thanks}**\n`
                }
            }

            embed = new Discord.MessageEmbed()
                .setTitle(":heartpulse: Thanks :heartpulse:")
                .setColor(colors.purple)
                .setDescription("Classifica di ringraziamenti nel server")
                .addFields([
                    {
                        name: ":gift_heart: Premi",
                        value: `Ogni **Domenica** alle **18:00** i primi **3 utenti** della **classifica settimanale** vinceranno dei **premi** come XP e Coins
_Vengono contati i ringrazimenti della settimana precedente e non quelli totali_`
                    },
                    {
                        name: ":diamond_shape_with_a_dot_inside: Classifica settimanale",
                        value: leaderboardThanks ? `Il tuo rank: ${leaderboardListThanks.findIndex(x => x.id == interaction.user.id) < 0 ? "###" : `**#${leaderboardListThanks.findIndex(x => x.id == interaction.user.id) + 1}** ${interaction.user.toString()} - **${leaderboardListThanks.find(x => x.id == interaction.user.id).thanks}**`}\n\n${leaderboardThanks}` : "_Nessun ringraziamento_"
                    }
                ])

            if (totPage > 0)
                embed.setFooter({ text: `Page ${page}/${totPage}` })

            const button1 = new Discord.MessageButton()
                .setCustomId(`thanksLb,${interaction.user.id},settimanale,1,1`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Previous2"))

            const button2 = new Discord.MessageButton()
                .setCustomId(`thanksLb,${interaction.user.id},settimanale,${page - 1},2`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Previous"))

            if (page == 1) {
                button1.setDisabled()
                button2.setDisabled()
            }

            const button3 = new Discord.MessageButton()
                .setCustomId(`thanksLb,${interaction.user.id},settimanale,${page + 1},3`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Next"))

            const button4 = new Discord.MessageButton()
                .setCustomId(`thanksLb,${interaction.user.id},settimanale,${totPage},4`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Next2"))

            if (page == totPage || totPage == 0) {
                button3.setDisabled()
                button4.setDisabled()
            }

            row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)
                .addComponents(button3)
                .addComponents(button4)
        }
        else if (mode == "generale") {
            let leaderboardListThanks = userstatsList.filter(x => x.totalThanks).sort((a, b) => (a.totalThanks < b.totalThanks) ? 1 : ((b.totalThanks < a.totalThanks) ? -1 : 0));
            let leaderboardThanks = ""

            let totPage = Math.ceil(leaderboardListThanks.length / 10)
            let page = 1;

            for (let i = 10 * (page - 1); i < 10 * page; i++) {
                if (leaderboardListThanks[i]) {
                    switch (i) {
                        case 0:
                            leaderboardThanks += ":first_place: ";
                            break
                        case 1:
                            leaderboardThanks += ":second_place: "
                            break
                        case 2:
                            leaderboardThanks += ":third_place: "
                            break
                        default:
                            leaderboardThanks += `**#${i + 1}** `
                    }

                    let utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == leaderboardListThanks[i].id);
                    leaderboardThanks += `${utente.toString()} - **${leaderboardListThanks[i].totalThanks}**\n`
                }
            }

            embed = new Discord.MessageEmbed()
                .setTitle(":heartpulse: Thanks :heartpulse:")
                .setColor(colors.purple)
                .setDescription("Classifica di ringraziamenti nel server")
                .addFields([
                    {
                        name: ":gift_heart: Premi",
                        value: `Ogni **Domenica** alle **18:00** i primi **3 utenti** della **classifica settimanale** vinceranno dei **premi** come XP e Coins
_Vengono contati i ringrazimenti della settimana precedente e non quelli totali_`
                    },
                    {
                        name: ":globe_with_meridians: Classifica generale",
                        value: leaderboardThanks ? `Il tuo rank: ${leaderboardListThanks.findIndex(x => x.id == interaction.user.id) < 0 ? "###" : `**#${leaderboardListThanks.findIndex(x => x.id == interaction.user.id) + 1}** ${interaction.user.toString()} - **${leaderboardListThanks.find(x => x.id == interaction.user.id).totalThanks}**`}\n\n${leaderboardThanks}` : "_Nessun ringraziamento_"
                    }
                ])

            if (totPage > 0)
                embed.setFooter({ text: `Page ${page}/${totPage}` })

            const button1 = new Discord.MessageButton()
                .setCustomId(`thanksLb,${interaction.user.id},generale,1,1`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Previous2"))

            const button2 = new Discord.MessageButton()
                .setCustomId(`thanksLb,${interaction.user.id},generale,${page - 1},2`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Previous"))

            if (page == 1) {
                button1.setDisabled()
                button2.setDisabled()
            }

            const button3 = new Discord.MessageButton()
                .setCustomId(`thanksLb,${interaction.user.id},generale,${page + 1},3`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Next"))

            const button4 = new Discord.MessageButton()
                .setCustomId(`thanksLb,${interaction.user.id},generale,${totPage},4`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Next2"))

            if (page == totPage || totPage == 0) {
                button3.setDisabled()
                button4.setDisabled()
            }

            row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)
                .addComponents(button3)
                .addComponents(button4)
        }
        else if (mode == "tutorial") {
            embed = new Discord.MessageEmbed()
                .setTitle(":heartpulse: Thanks :heartpulse:")
                .setColor(colors.purple)
                .setDescription("Classifica di ringraziamenti nel server")
                .addFields([
                    {
                        name: ":grey_question: Come ricevere Ringraziamenti",
                        value: `
**Aiutanto** un utente nella chat <#${settings.idCanaliServer.help}> con il suo problema, lui __se vorrà__ potrà utilizzare il comando </thankyou:1018431018295902238> per **ringraziarti**.
Una volta che tu avrai **accettato**, ti verrà consegnato questo ringraziamento. Pian piano **scalando** la classifica settimanale puoi ricevere dei regali`

                    },
                    {
                        name: ":gift_heart: Premi",
                        value: `Ogni **Domenica** alle **18:00** i primi **3 utenti** della **classifica settimanale** vinceranno dei **premi** come XP e Coins
_Vengono contati i ringrazimenti della settimana precedente e non quelli totali_`
                    }
                ])
        }

        const button5 = new Discord.MessageButton()
            .setLabel("Classifica settimanale")
            .setStyle(mode == "settimanale" ? "SUCCESS" : "PRIMARY")
            .setCustomId(`thanks,${interaction.user.id},settimanale`)

        const button6 = new Discord.MessageButton()
            .setLabel("Classifica generale")
            .setStyle(mode == "generale" ? "SUCCESS" : "PRIMARY")
            .setCustomId(`thanks,${interaction.user.id},generale`)

        const button7 = new Discord.MessageButton()
            .setLabel("Come ricevere Ringraziamenti")
            .setStyle(mode == "tutorial" ? "SUCCESS" : "SECONDARY")
            .setCustomId(`thanks,${interaction.user.id},tutorial`)

        let row2 = new Discord.MessageActionRow()
            .addComponents(button5)
            .addComponents(button6)
            .addComponents(button7)

        interaction.message.edit({ embeds: [embed], components: row ? [row, row2] : [row2] })
    },
};