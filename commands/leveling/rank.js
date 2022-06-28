const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const levelColor = require("../../config/ranking/levelColor.json")
const { replyMessage } = require("../../functions/general/replyMessage")
const { getXpNecessari } = require("../../functions/leveling/getXpNecessari")
const { humanize } = require("../../functions/general/humanize")
const { addUser } = require("../../functions/database/addUser")
const { getUser } = require("../../functions/database/getUser")
const { getAllUsers } = require("../../functions/database/getAllUsers")
const { getEmoji } = require("../../functions/general/getEmoji")
const { getTaggedUser } = require("../../functions/general/getTaggedUser")

const time_now = new Date().toLocaleString();
module.exports = {
    name: "rank",
    description: "Visualizzare stastiche ranking di un utente",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 10,
    syntax: "/rank (user)",
    category: "ranking",
    data: {
        options: [
            {
                name: "user",
                description: "Utente di cui vedere il rank",
                type: "STRING",
                required: false
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user")) || interaction.user; /*>*/ console.log(`rank.js > Ottengo utente taggato > ${time_now}`);

        if (utente.bot) {
            /*>*/ console.log(`rank.js > Errore statistiche a bot > ${time_now}`);
            return replyMessage(client, interaction, "Warning", "Non un bot", "Non puoi avere le statistiche ranking di un bot", comando);
        }

        let userstats = await getUser(utente.id); /*>*/ console.log(`rank.js > Ottengo userstats utente > ${time_now}`);
        if (!userstats) userstats = await addUser(interaction.guild.members.cache.get(utente.id) || utente); /*>*/ console.log(`rank.js > Aggiungo userstats utente > ${time_now}`);

        console.log(userstats)

        let xpProgress = ""
        let numEmoji = 8;
        let maxValue = getXpNecessari(userstats.leveling.level + 1) - getXpNecessari(userstats.leveling.level); /*>*/ console.log(`rank.js > Calcolo mazValue > ${time_now}`);
        let value = parseInt(userstats.leveling.xp - getXpNecessari(userstats.leveling.level)); /*>*/ console.log(`rank.js > Calcolo value > ${time_now}`);

        for (let i = 1; i <= numEmoji; i++) {
            /*>*/ console.log(`rank.js > Inizio ciclo "for" emoji (${i}) > ${time_now}`);
            if (i == 1) {
                if (value >= 1 * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji / 3))
                    xpProgress += getEmoji(client, "1Full")
                else if (value >= parseInt(maxValue / numEmoji))
                    xpProgress += getEmoji(client, "13")
                else if (value >= parseInt(maxValue / numEmoji / 3 * 2))
                    xpProgress += getEmoji(client, "12")
                else if (value >= parseInt(maxValue / numEmoji / 3 * 1))
                    xpProgress += getEmoji(client, "11")
                else
                    xpProgress += getEmoji(client, "10")
            }
            else if (i == numEmoji) {
                if (value >= (i - 1) * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji))
                    xpProgress += getEmoji(client, "3Full")
                else if (value >= (i - 1) * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji / 3 * 2))
                    xpProgress += getEmoji(client, "32")
                else if (value >= (i - 1) * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji / 3 * 1))
                    xpProgress += getEmoji(client, "31")
                else
                    xpProgress += getEmoji(client, "30")
            }
            else {
                if (value >= i * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji / 3))
                    xpProgress += getEmoji(client, "2Full")
                else if (value >= (i - 1) * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji))
                    xpProgress += getEmoji(client, "23")
                else if (value >= (i - 1) * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji / 3 * 2))
                    xpProgress += getEmoji(client, "22")
                else if (value >= (i - 1) * parseInt(maxValue / numEmoji) + parseInt(maxValue / numEmoji / 3 * 1))
                    xpProgress += getEmoji(client, "21")
                else
                    xpProgress += getEmoji(client, "20")
            }
        }

        let userstatsList = await getAllUsers(client); /*>*/ console.log(`rank.js > Ottengo tutti gli utenti > ${time_now}`)
        let leaderboardListXp = userstatsList.sort((a, b) => (a.leveling.xp < b.leveling.xp) ? 1 : ((b.leveling.xp < a.leveling.xp) ? -1 : 0)); /*>*/ console.log(`rank.js > Sort xp tutti gli utenti > ${time_now}`)
        let positionXp = leaderboardListXp.findIndex(x => x.id == utente.id) + 1; /*>*/ console.log(`rank.js > Ottengo positionXp > ${time_now}`)

        let leaderboardListEconomy = userstatsList.sort((a, b) => (a.economy.money < b.economy.money) ? 1 : ((b.economy.money < a.economy.money) ? -1 : 0)); /*>*/ console.log(`rank.js > Sort economy tutti gli utenti > ${time_now}`)
        let positionEconomy = leaderboardListEconomy.findIndex(x => x.id == utente.id) + 1; /*>*/ console.log(`rank.js > Ottengo positionEconomy > ${time_now}`)

        let embed = new Discord.MessageEmbed()
            .setTitle(`Ranking - ${interaction.guild.members.cache.get(utente.id)?.nickname ? interaction.guild.members.cache.get(utente.id).nickname : utente.username}`)
            .setColor(levelColor[userstats.leveling.level])
            .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
            .addField(`:beginner: Level ${userstats.leveling.level} - XP: ${humanize(userstats.leveling.xp)}`, `

${xpProgress}
XP ${humanize(userstats.leveling.xp - getXpNecessari(userstats.leveling.level))}/${humanize(getXpNecessari(userstats.leveling.level + 1) - getXpNecessari(userstats.leveling.level))} ${positionXp > 0 ? `- Rank #${positionXp}` : ""}`)
            .addField(`:coin: ${humanize(userstats.economy.money)}$`, `${Object.keys(userstats.economy.inventory).length == 0 ? "0" : Object.values(userstats.economy.inventory).reduce((a, b) => a + b)} ${Object.keys(userstats.economy.inventory).length == 0 ? "Items" : Object.values(userstats.economy.inventory).reduce((a, b) => a + b) == 1 ? "Item" : "Items"} ${positionEconomy > 0 ? `- Rank #${positionEconomy}` : ""}`)

            /*>*/ console.log(`rank.js > Creo l'embed > ${time_now}`)

        interaction.reply({ embeds: [embed] }); /*>*/ console.log(`rank.js > Mando il msg > ${time_now}`);
    },
};