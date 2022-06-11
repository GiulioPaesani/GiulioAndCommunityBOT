const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../../config/general/settings.json")
const { getAllUsers } = require("../../../functions/database/getAllUsers")
const { getServer } = require("../../../functions/database/getServer")
const { getEmoji } = require("../../../functions/general/getEmoji")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: `interactionCreate`,
    client: "fun",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("avantiClb")) return

        interaction.deferUpdate().catch(() => { })

        if (isMaintenance(interaction.user.id)) return

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let userstatsList = getAllUsers(client)

        let leaderboardListCorrect = userstatsList.sort((a, b) => (a.counting.correct < b.counting.correct) ? 1 : ((b.counting.correct < a.counting.correct) ? -1 : 0))
        let leaderboardCorrect = ""

        let totPage = Math.ceil(leaderboardListCorrect.length / 10)
        let page = parseInt(interaction.customId.split(",")[2]) + 1;
        if (page > totPage) return

        for (let i = 10 * (page - 1); i < 10 * page; i++) {
            if (leaderboardListCorrect[i]) {

                switch (i) {
                    case 0:
                        leaderboardCorrect += ":first_place: ";
                        break
                    case 1:
                        leaderboardCorrect += ":second_place: "
                        break
                    case 2:
                        leaderboardCorrect += ":third_place: "
                        break
                    default:
                        leaderboardCorrect += `**#${i + 1}** `
                }

                let utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == leaderboardListCorrect[i].id)
                leaderboardCorrect += `${utente.toString()} - **${leaderboardListCorrect[i].counting.correct}**\n`
            }
        }

        let leaderboardListScore = userstatsList.sort((a, b) => (a.bestScore < b.bestScore) ? 1 : ((b.bestScore < a.bestScore) ? -1 : 0))
        let leaderboardScore = ""

        for (let i = 10 * (page - 1); i < 10 * page; i++) {
            if (leaderboardListScore[i]) {
                switch (i) {
                    case 0:
                        leaderboardScore += ":first_place: ";
                        break
                    case 1:
                        leaderboardScore += ":second_place: "
                        break
                    case 2:
                        leaderboardScore += ":third_place: "
                        break
                    default:
                        leaderboardScore += `**#${i + 1}** `
                }

                let utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == leaderboardListScore[i].id)
                leaderboardScore += `${utente.toString()} - **${leaderboardListScore[i].counting.bestScore}**\n`
            }
        }

        let serverstats = getServer()

        let embed = new Discord.MessageEmbed()
            .setTitle("COUNTING - GiulioAndCommunity")
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setDescription("Statistiche counting di tutti gli utenti nel server")
            .addField(":1234: Last score", `${serverstats.counting.lastScore} (${moment(serverstats.counting.timeLastScore).fromNow()})`, true)
            .addField(":trophy: Best score", `${serverstats.counting.bestScore} (${moment(serverstats.counting.timeBestScore).fromNow()})`, true)
            .addField(":medal: Last user", client.users.cache.get(serverstats.counting.lastUser).toString(), true)
            .addField(":white_check_mark: Total corrects", serverstats.counting.correct.toString(), true)
            .addField(":x: Total incorrects", serverstats.counting.incorrect.toString(), true)
            .addField(":pencil2: Total updated", serverstats.counting.updated.toString())
            .addField(":wastebasket: Total deleted", serverstats.counting.deleted.toString())
            .addField(":blue_circle: Score leaderboard", leaderboardScore, true)
            .addField(":green_circle: Corrects leaderboard", leaderboardCorrect, true)
            .setFooter({ text: `Page ${page}/${totPage}` })

        let button1 = new Discord.MessageButton()
            .setCustomId(`indietro2Clb,${interaction.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous2"))

        let button2 = new Discord.MessageButton()
            .setCustomId(`indietroClb,${interaction.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous"))

        if (page == 1) {
            button1.setDisabled()
            button2.setDisabled()
        }

        let button3 = new Discord.MessageButton()
            .setCustomId(`avantiClb,${interaction.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next"))

        let button4 = new Discord.MessageButton()
            .setCustomId(`avanti2Clb,${interaction.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next2"))

        if (page == totPage) {
            button3.setDisabled()
            button4.setDisabled()
        }

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)

        interaction.message.edit({ embeds: [embed], components: [row] })
    },
};