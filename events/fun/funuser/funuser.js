const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../../config/general/settings.json")
const { addUser } = require("../../../functions/database/addUser")
const { getAllUsers } = require("../../../functions/database/getAllUsers")
const { getServer } = require("../../../functions/database/getServer")
const { getUser } = require("../../../functions/database/getUser")
const { getEmoji } = require("../../../functions/general/getEmoji")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("funuser")) return

        interaction.deferUpdate().catch(() => { })

        if (isMaintenance(interaction.user.id)) return

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let game = interaction.customId.split(",")[2]

        let embed

        let utente = client.users.cache.get(interaction.customId.split(",")[3])

        let userstats = await getUser(utente.id)
        if (!userstats) userstats = await addUser(interaction.guild.members.cache.get(utente.id) || utente)

        let serverstats = await getServer()

        if (game == "counting") {
            embed = new Discord.MessageEmbed()
                .setTitle(`COUNTING - ${interaction.guild.members.cache.get(utente.id)?.nickname ? interaction.guild.members.cache.get(utente.id).nickname : utente.username}`)
                .setDescription("Tutte le statistiche di counting su questo utente")
                .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
                .addField(":medal: Last score", `${userstats.counting.lastScore} ${moment(userstats.counting.timeLastScore).isValid() ? `(${moment(userstats.counting.timeLastScore).fromNow()})` : ""}`, true)
                .addField(":trophy: Best score", `${userstats.counting.bestScore} ${moment(userstats.counting.timeBestScore).isValid() ? `(${moment(userstats.counting.timeBestScore).fromNow()})` : ""}`, true)
                .addField(":rocket: Streak", userstats.counting.streak.toString(), true)
                .addField(":white_check_mark: Total corrects", `${userstats.counting.correct} ${(100 * userstats.counting.correct / (userstats.counting.correct + userstats.counting.incorrect)) ? `(${(100 * userstats.counting.correct / (userstats.counting.correct + userstats.counting.incorrect)).toFixed(2)}%)` : ""}`, true)
                .addField(":x: Total incorrects", `${userstats.counting.incorrect} ${(100 * userstats.counting.incorrect / (userstats.counting.correct + userstats.counting.incorrect)) ? `(${(100 * userstats.counting.incorrect / (userstats.counting.correct + userstats.counting.incorrect)).toFixed(2)}%)` : ""}`, true)
                .addField(":pencil2: Total updated", userstats.counting.updated.toString(), true)
                .addField(":wastebasket: Total deleted", userstats.counting.deleted.toString(), true)
        }
        else if (game == "countingplus") {
            embed = new Discord.MessageEmbed()
                .setTitle(`COUNTING PLUS - ${interaction.guild.members.cache.get(utente.id)?.nickname ? interaction.guild.members.cache.get(utente.id).nickname : utente.username}`)
                .setDescription("Tutte le statistiche di counting plus su questo utente")
                .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
                .addField(":medal: Last score", `${userstats.countingplus.lastScore} ${moment(userstats.countingplus.timeLastScore).isValid() ? `(${moment(userstats.countingplus.timeLastScore).fromNow()})` : ""}`, true)
                .addField(":rocket: Streak", userstats.countingplus.streak.toString(), true)
                .addField(":white_check_mark: Total corrects", `${userstats.countingplus.correct} ${(100 * userstats.countingplus.correct / (userstats.countingplus.correct + userstats.countingplus.incorrect)) ? `(${(100 * userstats.countingplus.correct / (userstats.countingplus.correct + userstats.countingplus.incorrect)).toFixed(2)}%)` : ""}`, true)
                .addField(":x: Total incorrects", `${userstats.countingplus.incorrect} ${(100 * userstats.countingplus.incorrect / (userstats.countingplus.correct + userstats.countingplus.incorrect)) ? `(${(100 * userstats.countingplus.incorrect / (userstats.countingplus.correct + userstats.countingplus.incorrect)).toFixed(2)}%)` : ""}`, true)
                .addField(":pencil2: Total updated", userstats.countingplus.updated.toString(), true)
                .addField(":wastebasket: Total deleted", userstats.countingplus.deleted.toString(), true)
        }
        else if (game == "onewordstory") {
            let reverseWords = [...serverstats.onewordstory.words].reverse()
            embed = new Discord.MessageEmbed()
                .setTitle(`ONE WORD STORY - ${interaction.guild.members.cache.get(utente.id)?.nickname ? interaction.guild.members.cache.get(utente.id).nickname : utente.username}`)
                .setDescription("Tutte le statistiche di one word story su questo utente")
                .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
                .addField(":pencil2: Last word", !reverseWords.find(x => x.user == utente.id) ? "_No words today_" : `"${reverseWords.find(x => x.user == utente.id).word}" (${moment(reverseWords.find(x => x.user == utente.id).time).fromNow()})`)
                .addField(":orange_book: Stories created", userstats.onewordstory.totStories.toString(), true)
                .addField(":thought_balloon: Total words today", userstats.onewordstory.totWordsToday.toString(), true)
                .addField(":speech_balloon: Total words", userstats.onewordstory.totWords.toString(), true)
        }

        let button1 = new Discord.MessageButton()
            .setCustomId(`funuser,${interaction.user.id},counting,${utente.id}`)
            .setStyle(game == "counting" ? "SUCCESS" : "PRIMARY")
            .setLabel("Counting")

        let button2 = new Discord.MessageButton()
            .setCustomId(`funuser,${interaction.user.id},countingplus,${utente.id}`)
            .setStyle(game == "countingplus" ? "SUCCESS" : "PRIMARY")
            .setLabel("Counting plus")

        let button3 = new Discord.MessageButton()
            .setCustomId(`funuser,${interaction.user.id},onewordstory,${utente.id}`)
            .setStyle(game == "onewordstory" ? "SUCCESS" : "PRIMARY")
            .setLabel("One word story")

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)

        interaction.message.edit({ embeds: [embed], components: [row] })
    },
};