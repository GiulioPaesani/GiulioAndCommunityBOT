const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../../config/general/settings.json")
const { replyMessage } = require("../../../functions/general/replyMessage")
const { addUser } = require("../../../functions/database/addUser")
const { getUser } = require("../../../functions/database/getUser")
const { getTaggedUser } = require("../../../functions/general/getTaggedUser")

module.exports = {
    name: "funuser",
    description: "Visualizzare statistiche di un utente di counting, counting plus e one word story",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/funuser (user)",
    category: "fun",
    data: {
        options: [
            {
                name: "user",
                description: "Utente di cui vedere le statistiche",
                type: "STRING",
                required: false
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user")) || interaction.user

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non un bot", "Non puoi avere le statistiche di gioco di un bot", comando)
        }

        let userstats = await getUser(utente.id)
        if (!userstats) userstats = await addUser(interaction.guild.members.cache.get(utente.id) || utente)

        let embed = new Discord.MessageEmbed()
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

        let button1 = new Discord.MessageButton()
            .setCustomId(`funuser,${interaction.user.id},counting,${utente.id}`)
            .setStyle("SUCCESS")
            .setLabel("Counting")

        let button2 = new Discord.MessageButton()
            .setCustomId(`funuser,${interaction.user.id},countingplus,${utente.id}`)
            .setStyle("PRIMARY")
            .setLabel("Counting plus")

        let button3 = new Discord.MessageButton()
            .setCustomId(`funuser,${interaction.user.id},onewordstory,${utente.id}`)
            .setStyle("PRIMARY")
            .setLabel("One word story")

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};