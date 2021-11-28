module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (settings.inMaintenanceMode)
            if (button.clicker.user.id != settings.idGiulio) return

        if (!button.id.startsWith("confermaRegalo")) return

        if (button.clicker.user.id != button.id.split(",")[1]) return

        var avvento = serverstats.avvento[button.clicker.user.id]
        if (!avvento) return

        if (avvento.regaloFatto) {
            var embed = new Discord.MessageEmbed()
                .setTitle("Ricompensa già usata")
                .setColor(`#8F8F8F`)
                .setDescription("Hai già regalato **500xp** a un utente, puoi farlo solo una volta")
                .setThumbnail('https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png');

            await button.message.edit(embed, null)
            return
        }

        var utente = client.users.cache.get(button.id.split(",")[2])
        if (!utente) return

        var embed = new Discord.MessageEmbed()
            .setTitle("Regala 500xp")
            .setColor("#22c90c")
            .setDescription(`Hai regalato **500 punti esperienza** a ${utente.toString()}
Bravo, sei stato un bravo Babbo Natale!`)
            .setThumbnail("https://i.postimg.cc/1XtKR0M0/Senza-titolo-1.jpg")

        await button.message.edit(embed, null)

        var embed = new Discord.MessageEmbed()
            .setTitle("Un piccolo regalo per te")
            .setColor("#ed1c24")
            .setDescription(`${button.clicker.user.toString()} ha avuto la possibilità grazie all'**avvento** di fare un **piccolo regalo** a un utente e ha scelto proprio te!
Hai ricevuto **500 punti esperienza**`)
            .setThumbnail("https://i.postimg.cc/1XtKR0M0/Senza-titolo-1.jpg")

        await utente.send(embed)
            .catch(() => { })

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return

        userstats.xp += 500

        var level = userstats.level

        while (userstats.xp >= calcoloXpNecessario(level + 1)) {
            level++;
        }

        if (level != userstats.level) {
            const levelColor = require("../../config/levelColor.json")

            var embed2 = new Discord.MessageEmbed()
                .setTitle("LEVEL " + userstats.level)
                .setColor(levelColor[userstats.level])

            if (userstats.level < 5) {
                embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${settings.ruoliLeveling.level5}>`)
            }
            else if (userstats.level == 5) {
                embed2.addField("Nuovi privilegi", `Con il <@&${settings.ruoliLeveling.level5}> hai sbloccato nuove funzioni\r- **Streaming** nelle chat vocali\r- Aggiungere **reazioni** ai messaggi\r- Allegare **file** nelle chat testuali\r- Creare **stanze private** testuali`)
            }
            else if (userstats.level < 10) {
                embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${settings.ruoliLeveling.level10}>`)
            }
            else if (userstats.level == 10) {
                embed2.addField("Nuovi privilegi", `Con il <@&${settings.ruoliLeveling.level10}> hai sbloccato nuove funzioni\r- Mandare **emoji esterne**\r- Creare **stanze private** vocali`)
            }
            else if (userstats.level < 15) {
                embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${settings.ruoliLeveling.level15}>`)
            }
            else if (userstats.level == 15) {
                embed2.addField("Nuovi privilegi", `Con il <@&${settings.ruoliLeveling.level15}> hai sbloccato nuove funzioni\r- Scrivere in chat <#${settings.idCanaliServer.noMicChat}> per utilizzare <@414925323197612032>\r- Cambiare il proprio **nickname**\r- Utilizzare il comando **!say**`)
            }
            else if (userstats.level < 20) {
                embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${settings.ruoliLeveling.level20}>`)
            }
            else if (userstats.level == 20) {
                embed2.addField("Nuovi privilegi", `Con il <@&${settings.ruoliLeveling.level20}> hai sbloccato nuove funzioni\r- Creare **stanze private** tesuali + vocali`)
            }
            else if (userstats.level < 25) {
                embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${settings.ruoliLeveling.level25}>`)
            }
            else if (userstats.level == 25) {
                embed2.addField("Nuovi privilegi", `Con il <@&${settings.ruoliLeveling.level25}> hai sbloccato nuove funzioni\r- 10% di **Boost** di esperienza nel livellamento`)
            }
            else if (userstats.level < 30) {
                embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${settings.ruoliLeveling.level30}>`)
            }
            else if (userstats.level == 30) {
                embed2.addField(`Nuovi privilegi`, `Con il <@&${settings.ruoliLeveling.level30}> hai sbloccato nuove funzioni\r- Scrivere nella chat <#${settings.idCanaliServer.selfAdv}>`)
            }
            else if (userstats.level < 50) {
                embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${settings.ruoliLeveling.level50}>`)
            }
            else if (userstats.level == 50) {
                embed2.addField(`Nuovi privilegi`, `Con il <@&${settings.ruoliLeveling.level50}> hai sbloccato nuove funzioni\r- 20% di **Boost** di esperienza nel livellamento`)
            }
            else if (userstats.level < 100) {
                embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${settings.ruoliLeveling.level100}>`)
            }
            else if (userstats.level == 100) {
                embed2.addField(`Nuovi privilegi`, `Con il <@&${settings.ruoliLeveling.level100}> hai sbloccato nuove funzioni\r- **Priorità di parola** nelle chat vocali`)
            }

            var canale = await client.channels.cache.get(settings.idCanaliServer.levelUp);
            await canale.send(button.clicker.user.toString() + ` hai raggiunto un **nuovo livello**`, embed2)
        }

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
        serverstats.avvento[button.clicker.user.id].regaloFatto = true
    },
};