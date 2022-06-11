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
        if (!interaction.customId.startsWith("funserver")) return

        interaction.deferUpdate().catch(() => { })

        if (isMaintenance(interaction.user.id)) return

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let userstatsList = getAllUsers(client)

        let game = interaction.customId.split(",")[2]

        let row, embed
        let serverstats = getServer()

        if (game == "counting") {
            let leaderboardListCorrect = userstatsList.sort((a, b) => (a.counting.correct < b.counting.correct) ? 1 : ((b.counting.correct < a.counting.correct) ? -1 : 0))
            let leaderboardCorrect = ""

            let totPage = Math.ceil(leaderboardListCorrect.length / 10)
            let page = 1

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

            embed = new Discord.MessageEmbed()
                .setTitle("COUNTING - GiulioAndCommunity")
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setDescription("Statistiche counting di tutti gli utenti nel server")
                .addField(":1234: Last score", `${serverstats.counting.lastScore} (${moment(serverstats.counting.timeLastScore).fromNow()})`, true)
                .addField(":medal: Last user", client.users.cache.get(serverstats.counting.lastUser).toString(), true)
                .addField(":trophy: Best score", `${serverstats.counting.bestScore} (${moment(serverstats.counting.timeBestScore).fromNow()})`)
                .addField(":white_check_mark: Total corrects", serverstats.counting.correct.toString(), true)
                .addField(":x: Total incorrects", serverstats.counting.incorrect.toString(), true)
                .addField(":pencil2: Total updated", serverstats.counting.updated.toString(), true)
                .addField(":wastebasket: Total deleted", serverstats.counting.deleted.toString())
                .addField(":blue_circle: Score leaderboard", leaderboardScore, true)
                .addField(":green_circle: Corrects leaderboard", leaderboardCorrect, true)
                .setFooter({ text: `Page ${page}/${totPage}` })

            let button1 = new Discord.MessageButton()
                .setCustomId(`funLb,${interaction.user.id},counting,1,1`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Previous2"))

            let button2 = new Discord.MessageButton()
                .setCustomId(`funLb,${interaction.user.id},counting,${page - 1},2`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Previous"))

            if (page == 1) {
                button1.setDisabled()
                button2.setDisabled()
            }

            let button3 = new Discord.MessageButton()
                .setCustomId(`funLb,${interaction.user.id},counting,${page + 1},3`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Next"))

            let button4 = new Discord.MessageButton()
                .setCustomId(`funLb,${interaction.user.id},counting,${totPage},4`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Next2"))

            if (page == totPage) {
                button3.setDisabled()
                button4.setDisabled()
            }

            row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)
                .addComponents(button3)
                .addComponents(button4)
        }
        else if (game == "countingplus") {
            let leaderboardListCorrect = userstatsList.sort((a, b) => (a.countingplus.correct < b.countingplus.correct) ? 1 : ((b.countingplus.correct < a.countingplus.correct) ? -1 : 0))
            let leaderboardCorrect = ""

            let totPage = Math.ceil(leaderboardListCorrect.length / 10)
            let page = 1

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
                    leaderboardCorrect += `${utente.toString()} - **${leaderboardListCorrect[i].countingplus.correct}**\n`
                }
            }

            embed = new Discord.MessageEmbed()
                .setTitle("COUNTING PLUS - GiulioAndCommunity")
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setDescription("Statistiche counting plus di tutti gli utenti nel server")
                .addField(":1234: Last score", `${serverstats.countingplus.lastScore} (${moment(serverstats.countingplus.timeLastScore).fromNow()})`, true)
                .addField(":medal: Last user", client.users.cache.get(serverstats.countingplus.lastUser).toString(), true)
                .addField(":part_alternation_mark: Count", `${serverstats.countingplus.operator}${serverstats.countingplus.gap} every time`)
                .addField(":white_check_mark: Total corrects", serverstats.countingplus.correct.toString(), true)
                .addField(":x: Total incorrects", serverstats.countingplus.incorrect.toString(), true)
                .addField(":pencil2: Total updated", serverstats.countingplus.updated.toString(), true)
                .addField(":wastebasket: Total deleted", serverstats.countingplus.deleted.toString(), true)
                .addField(":green_circle: Corrects leaderboard", leaderboardCorrect)
                .setFooter({ text: `Page ${page}/${totPage}` })

            let button1 = new Discord.MessageButton()
                .setCustomId(`funLb,${interaction.user.id},countingplus,1,1`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Previous2"))

            let button2 = new Discord.MessageButton()
                .setCustomId(`funLb,${interaction.user.id},countingplus,${page - 1},2`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Previous"))

            if (page == 1) {
                button1.setDisabled()
                button2.setDisabled()
            }

            let button3 = new Discord.MessageButton()
                .setCustomId(`funLb,${interaction.user.id},countingplus,${page + 1},3`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Next"))

            let button4 = new Discord.MessageButton()
                .setCustomId(`funLb,${interaction.user.id},countingplus,${totPage},4`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Next2"))

            if (page == totPage) {
                button3.setDisabled()
                button4.setDisabled()
            }

            row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)
                .addComponents(button3)
                .addComponents(button4)
        }
        else if (game == "onewordstory") {
            let leaderboardListWord = userstatsList.sort((a, b) => (a.onewordstory.totWords < b.onewordstory.totWords) ? 1 : ((b.onewordstory.totWords < a.onewordstory.totWords) ? -1 : 0))
            let leaderboardWord = ""

            let totPage = Math.ceil(leaderboardListWord.length / 10)
            let page = 1

            for (let i = 10 * (page - 1); i < 10 * page; i++) {
                if (leaderboardListWord[i]) {

                    switch (i) {
                        case 0:
                            leaderboardWord += ":first_place: ";
                            break
                        case 1:
                            leaderboardWord += ":second_place: "
                            break
                        case 2:
                            leaderboardWord += ":third_place: "
                            break
                        default:
                            leaderboardWord += `**#${i + 1}** `
                    }

                    let utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == leaderboardListWord[i].id)
                    leaderboardWord += `${utente.toString()} - **${leaderboardListWord[i].onewordstory.totWords}**\n`
                }
            }

            embed = new Discord.MessageEmbed()
                .setTitle("ONE WORD STORY - GiulioAndCommunity")
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setDescription("Statistiche one word story di tutti gli utenti nel server")
                .addField(":pencil2: Last word", serverstats.onewordstory.words.length == 0 ? "_No words today_" : `"${serverstats.onewordstory.words[serverstats.onewordstory.words.length - 1].word}" (${moment(serverstats.onewordstory.words[serverstats.onewordstory.words.length - 1].time).fromNow()})`, true)
                .addField(":medal: Last user", serverstats.onewordstory.words.length == 0 ? "_No users today_" : client.users.cache.get(serverstats.onewordstory.words[serverstats.onewordstory.words.length - 1].user).toString(), true)
                .addField(":orange_book: Stories created", serverstats.onewordstory.totStories.toString())
                .addField(":thought_balloon: Total words today", serverstats.onewordstory.totWordsToday.toString(), true)
                .addField(":speech_balloon: Total words", serverstats.onewordstory.totWords.toString(), true)
                .addField(":green_circle: Words written leaderboard", leaderboardWord)
                .setFooter({ text: `Page ${page}/${totPage}` })

            let button1 = new Discord.MessageButton()
                .setCustomId(`funLb,${interaction.user.id},onewordstory,1,1`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Previous2"))

            let button2 = new Discord.MessageButton()
                .setCustomId(`funLb,${interaction.user.id},onewordstory,${page - 1},2`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Previous"))

            if (page == 1) {
                button1.setDisabled()
                button2.setDisabled()
            }

            let button3 = new Discord.MessageButton()
                .setCustomId(`funLb,${interaction.user.id},onewordstory,${page + 1},3`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Next"))

            let button4 = new Discord.MessageButton()
                .setCustomId(`funLb,${interaction.user.id},onewordstory,${totPage},4`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Next2"))

            if (page == totPage) {
                button3.setDisabled()
                button4.setDisabled()
            }

            row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)
                .addComponents(button3)
                .addComponents(button4)
        }

        let button5 = new Discord.MessageButton()
            .setCustomId(`funserver,${interaction.user.id},counting`)
            .setStyle(game == "counting" ? "SUCCESS" : "PRIMARY")
            .setLabel("Counting")

        let button6 = new Discord.MessageButton()
            .setCustomId(`funserver,${interaction.user.id},countingplus`)
            .setStyle(game == "countingplus" ? "SUCCESS" : "PRIMARY")
            .setLabel("Counting plus")

        let button7 = new Discord.MessageButton()
            .setCustomId(`funserver,${interaction.user.id},onewordstory`)
            .setStyle(game == "onewordstory" ? "SUCCESS" : "PRIMARY")
            .setLabel("One word story")

        let row2 = new Discord.MessageActionRow()
            .addComponents(button5)
            .addComponents(button6)
            .addComponents(button7)

        interaction.message.edit({ embeds: [embed], components: [row, row2] })
    },
};