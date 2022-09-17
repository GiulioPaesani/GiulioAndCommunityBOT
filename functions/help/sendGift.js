const Discord = require("discord.js")
const colors = require("../../config/general/colors.json")
const { getAllUsers } = require("../../functions/database/getAllUsers")
const { updateUser } = require("../../functions/database/updateUser")

const sendGift = async (client) => {
    const data = new Date()

    if (data.getHours() == 18 && data.getMinutes() == 0 && data.getSeconds() == 0 && data.getDay() == 0) {

        let userstatsList = await getAllUsers(client)
        let leaderboardListThanks = userstatsList.filter(x => x.thanks).sort((a, b) => (a.thanks < b.thanks) ? 1 : ((b.thanks < a.thanks) ? -1 : 0)).slice(0, 3);

        leaderboardListThanks.forEach(userstats => {
            let embed = new Discord.MessageEmbed()
                .setTitle(":heartpulse: Questa settimana hai aiutato tanto!")
                .setColor(colors.pink)
                .setDescription(`Grande! Nell'ultima settimana hai ricevuto **${userstats.thanks} ${userstats.thanks == 1 ? "ringraziamento" : "ringraziamenti"}**, si vede che ti piace aiutare :nerd:
                
Sei arrivato nella **TOP 3** della **classifica settimanale**, quindi ecco a te i tuoi **premi**:
+400 XP
+150 Coins

Continua così e diventa l'aiutante più d'aiuto di tutti!
_I ringraziamenti settimanali vengono resettati_`)

            client.users.cache.get(userstats.id).send({ embeds: [embed] })

            userstats.leveling.xp += 400
            userstats.economy.money += 150

            updateUser(userstats)
        })

        userstatsList.forEach(userstats => {
            if (userstats.thanks && userstats.thanks > 0) {
                userstats.thanks = 0
                updateUser(userstats)
            }
        })
    }
}

module.exports = { sendGift }