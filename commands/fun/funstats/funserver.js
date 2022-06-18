const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../../config/general/settings.json")
const { getAllUsers } = require("../../../functions/database/getAllUsers")
const { getServer } = require("../../../functions/database/getServer")
const { getEmoji } = require("../../../functions/general/getEmoji")

module.exports = {
    name: "funserver",
    description: "Visualizzare statistiche del server di counting, counting plus e one word story",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/funserver",
    category: "fun",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let userstatsList = getAllUsers(client)

        let leaderboardListCorrect = userstatsList.sort((a, b) => (a.counting.correct < b.counting.correct) ? 1 : ((b.counting.correct < a.counting.correct) ? -1 : 0))
        let leaderboardCorrect = ""

        let totPage = Math.ceil(leaderboardListCorrect.length / 10)
        let page = 1;

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

        let leaderboardListScore = userstatsList.sort((a, b) => (a.counting.bestScore < b.counting.bestScore) ? 1 : ((b.counting.bestScore < a.counting.bestScore) ? -1 : 0))
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

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)

        let button5 = new Discord.MessageButton()
            .setCustomId(`funserver,${interaction.user.id},counting`)
            .setStyle("SUCCESS")
            .setLabel("Counting")

        let button6 = new Discord.MessageButton()
            .setCustomId(`funserver,${interaction.user.id},countingplus`)
            .setStyle("PRIMARY")
            .setLabel("Counting plus")

        let button7 = new Discord.MessageButton()
            .setCustomId(`funserver,${interaction.user.id},onewordstory`)
            .setStyle("PRIMARY")
            .setLabel("One word story")

        let row2 = new Discord.MessageActionRow()
            .addComponents(button5)
            .addComponents(button6)
            .addComponents(button7)

        interaction.reply({ embeds: [embed], components: [row, row2] })
    },
};