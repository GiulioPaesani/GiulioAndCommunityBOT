const settings = require("../../config/general/settings.json")
const { getServer } = require("../../functions/database/getServer")

const newMonthsMember = async (client) => {
    let data = new Date()

    if (data.getMinutes() == 0 && data.getHours() == 0 && data.getSeconds() == 0 && data.getDate() == 1) {
        let serverstats = await getServer()
        let member = serverstats.monthmembers.find(x => x.month == `${data.getFullYear().toString().slice(2)}${(data.getMonth() + 1) < 10 ? "0" : ""}${data.getMonth() + 1}`)

        if (!member) return console.log("Member not found")

        let testi = [
            "È arrivato un nuovo mese, e come tutti i mesi, sono qua per annunciarvi il **membro del mese**",
            "Eccoci qua, sono di nuovo qua, nel primo giorno di un nuovo mese per comunicarvi il **membro del mese**",
            "Siete pronti? Siete carichi? Bhe perchè sono qua per annunciarvi il nuovo **membro del mese**",
            "Un nuovo giorno tanto atteso è arrivato, sono nuovamente qua per comunicarvi il **membro del mese**"
        ]

        let mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]

        let channel = client.channels.cache.get(settings.idCanaliServer.announcements)

        channel.send(`
----- 💖 **𝐌𝐎𝐍𝐓𝐇'𝐒 𝐌𝐄𝐌𝐁𝐄𝐑** 💖 -----
${testi[Math.floor(Math.random() * testi.length)]}

:face_with_monocle: Ma chi è il membro del mese?
Ogni mese lo staff **elegge** un utente all'interno del server che si merita questa carica, verrà scelto in base alla sua **attività** nel server, la sua **simpatia** o quanto è **divertente** nella community

Essere membro del mese è un **grande onore** e permetterà di ricevere alcuni **privilegi** esclusivi che avrete in questo periodo:
- **Ruolo** <@&${settings.idRuoloMonthMember}> separato dagli altri
- **Chat <#${settings.idCanaliServer.bar}> privata** con lo staff e l'ex-staff, dove parlare e discutere del più e del meno
- Poter eseguire i comandi **ovunque**
- Comparire nel comando \`/monthmembers\`

Andiamo subito alla parte più importante:
:face_with_hand_over_mouth: Il nuovo membro del mese di **${mesi[data.getMonth()]} ${data.getFullYear()}** è... <@${member}>!! Congratulazioni

Fate i bravi, ci vediamo il prossimo mese
`)

        let role = channel.guild.roles.cache.get(settings.idRuoloMonthMember)
        role.members.forEach(x => {
            x.roles.remove(role.id)
        })

        client.members.cache.get(member).roles.add(role.id)
    }
}

module.exports = { newMonthsMember }

