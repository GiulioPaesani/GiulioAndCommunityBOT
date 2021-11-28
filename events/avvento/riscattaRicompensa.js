module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (config.inMaintenanceMode)
            if (button.clicker.user.id != config.idGiulio) return

        if (!button.id.startsWith("riscattaRicompensa")) return

        var avvento = serverstats.avvento[button.clicker.user.id]
        if (!avvento) return

        //! Il 06/01 ripristinare tutto

        //? var day = new Date().getDate()
        //? var month = new Date().getMonth()
        var day = 30
        var month = 11

        if (month == 11 || (month == 0 && day <= 6)) {

        }
        else {
            return
        }

        var numGiorno = button.id.split(",")[1]

        if (avvento[numGiorno]) return

        var userstats = userstatsList.find(x => x.id == button.clicker.user.id);
        if (!userstats) return

        var embed = new Discord.MessageEmbed()
            .setTitle(`Giorno ${numGiorno}`)
            .setColor("#009245")
            .setThumbnail(avventoJSON.iconGiorno[numGiorno])
            .setDescription(`Ricompensa del **giorno ${numGiorno}** riscattata`)

        //per le emoji dire di riavviare

        switch (parseInt(numGiorno)) {
            case 1: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ecco a te i tuoi **100 punti xp**, controlla con \`!rank\` se hai superato un nuovo livello
                    `)

                userstats.xp += 100

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
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level5}>`)
                    }
                    else if (userstats.level == 5) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level5}> hai sbloccato nuove funzioni\r- **Streaming** nelle chat vocali\r- Aggiungere **reazioni** ai messaggi\r- Allegare **file** nelle chat testuali\r- Creare **stanze private** testuali`)
                    }
                    else if (userstats.level < 10) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level10}>`)
                    }
                    else if (userstats.level == 10) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level10}> hai sbloccato nuove funzioni\r- Mandare **emoji esterne**\r- Creare **stanze private** vocali`)
                    }
                    else if (userstats.level < 15) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level15}>`)
                    }
                    else if (userstats.level == 15) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level15}> hai sbloccato nuove funzioni\r- Scrivere in chat <#${config.idCanaliServer.noMicChat}> per utilizzare <@414925323197612032>\r- Cambiare il proprio **nickname**\r- Utilizzare il comando **!say**`)
                    }
                    else if (userstats.level < 20) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level20}>`)
                    }
                    else if (userstats.level == 20) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level20}> hai sbloccato nuove funzioni\r- Creare **stanze private** tesuali + vocali`)
                    }
                    else if (userstats.level < 25) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level25}>`)
                    }
                    else if (userstats.level == 25) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level25}> hai sbloccato nuove funzioni\r- 10% di **Boost** di esperienza nel livellamento`)
                    }
                    else if (userstats.level < 30) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level30}>`)
                    }
                    else if (userstats.level == 30) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level30}> hai sbloccato nuove funzioni\r- Scrivere nella chat <#${config.idCanaliServer.selfAdv}>`)
                    }
                    else if (userstats.level < 50) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level50}>`)
                    }
                    else if (userstats.level == 50) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level50}> hai sbloccato nuove funzioni\r- 20% di **Boost** di esperienza nel livellamento`)
                    }
                    else if (userstats.level < 100) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level100}>`)
                    }
                    else if (userstats.level == 100) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level100}> hai sbloccato nuove funzioni\r- **Priorità di parola** nelle chat vocali`)
                    }

                    var canale = await client.channels.cache.get(config.idCanaliServer.levelUp);
                    await canale.send(button.clicker.user.toString() + ` hai raggiunto un **nuovo livello**`, embed2)
                }
            } break
            case 2: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ora potrai utilizzare la funzione **here** nel comando \`!code\` in modo da mandare il codice direttamente in chat. Puoi farlo con \`!code [codice] here\`
                `)
            } break
            case 3: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Boost **x2** attivato, ora per le prossime **12h** per ogni messaggio riceverai dai 30 ai 80 punti
                `)

                serverstats.avvento[button.clicker.user.id].boost2 = new Date().getTime()
            } break
            case 4: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ecco a te i tuoi **200 punti xp**, controlla con \`!rank\` se hai superato un nuovo livello
                    `)

                userstats.xp += 200

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
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level5}>`)
                    }
                    else if (userstats.level == 5) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level5}> hai sbloccato nuove funzioni\r- **Streaming** nelle chat vocali\r- Aggiungere **reazioni** ai messaggi\r- Allegare **file** nelle chat testuali\r- Creare **stanze private** testuali`)
                    }
                    else if (userstats.level < 10) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level10}>`)
                    }
                    else if (userstats.level == 10) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level10}> hai sbloccato nuove funzioni\r- Mandare **emoji esterne**\r- Creare **stanze private** vocali`)
                    }
                    else if (userstats.level < 15) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level15}>`)
                    }
                    else if (userstats.level == 15) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level15}> hai sbloccato nuove funzioni\r- Scrivere in chat <#${config.idCanaliServer.noMicChat}> per utilizzare <@414925323197612032>\r- Cambiare il proprio **nickname**\r- Utilizzare il comando **!say**`)
                    }
                    else if (userstats.level < 20) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level20}>`)
                    }
                    else if (userstats.level == 20) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level20}> hai sbloccato nuove funzioni\r- Creare **stanze private** tesuali + vocali`)
                    }
                    else if (userstats.level < 25) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level25}>`)
                    }
                    else if (userstats.level == 25) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level25}> hai sbloccato nuove funzioni\r- 10% di **Boost** di esperienza nel livellamento`)
                    }
                    else if (userstats.level < 30) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level30}>`)
                    }
                    else if (userstats.level == 30) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level30}> hai sbloccato nuove funzioni\r- Scrivere nella chat <#${config.idCanaliServer.selfAdv}>`)
                    }
                    else if (userstats.level < 50) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level50}>`)
                    }
                    else if (userstats.level == 50) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level50}> hai sbloccato nuove funzioni\r- 20% di **Boost** di esperienza nel livellamento`)
                    }
                    else if (userstats.level < 100) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level100}>`)
                    }
                    else if (userstats.level == 100) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level100}> hai sbloccato nuove funzioni\r- **Priorità di parola** nelle chat vocali`)
                    }

                    var canale = await client.channels.cache.get(config.idCanaliServer.levelUp);
                    await canale.send(button.clicker.user.toString() + ` hai raggiunto un **nuovo livello**`, embed2)
                }
            } break
            case 5: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ora hai un livello in più. Scopri in <#${config.idCanaliServer.levelUp}> se hai ottenuto fantastici **privilegi**
                    `)

                userstats.level++
                userstats.xp = calcoloXpNecessario(userstats.level)

                const levelColor = require("../../config/levelColor.json")

                var embed2 = new Discord.MessageEmbed()
                    .setTitle("LEVEL " + userstats.level)
                    .setColor(levelColor[userstats.level])

                if (userstats.level < 5) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level5}>`)
                }
                else if (userstats.level == 5) {
                    embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level5}> hai sbloccato nuove funzioni\r- **Streaming** nelle chat vocali\r- Aggiungere **reazioni** ai messaggi\r- Allegare **file** nelle chat testuali\r- Creare **stanze private** testuali`)
                }
                else if (userstats.level < 10) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level10}>`)
                }
                else if (userstats.level == 10) {
                    embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level10}> hai sbloccato nuove funzioni\r- Mandare **emoji esterne**\r- Creare **stanze private** vocali`)
                }
                else if (userstats.level < 15) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level15}>`)
                }
                else if (userstats.level == 15) {
                    embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level15}> hai sbloccato nuove funzioni\r- Scrivere in chat <#${config.idCanaliServer.noMicChat}> per utilizzare <@414925323197612032>\r- Cambiare il proprio **nickname**\r- Utilizzare il comando **!say**`)
                }
                else if (userstats.level < 20) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level20}>`)
                }
                else if (userstats.level == 20) {
                    embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level20}> hai sbloccato nuove funzioni\r- Creare **stanze private** tesuali + vocali`)
                }
                else if (userstats.level < 25) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level25}>`)
                }
                else if (userstats.level == 25) {
                    embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level25}> hai sbloccato nuove funzioni\r- 10% di **Boost** di esperienza nel livellamento`)
                }
                else if (userstats.level < 30) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level30}>`)
                }
                else if (userstats.level == 30) {
                    embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level30}> hai sbloccato nuove funzioni\r- Scrivere nella chat <#${config.idCanaliServer.selfAdv}>`)
                }
                else if (userstats.level < 50) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level50}>`)
                }
                else if (userstats.level == 50) {
                    embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level50}> hai sbloccato nuove funzioni\r- 20% di **Boost** di esperienza nel livellamento`)
                }
                else if (userstats.level < 100) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level100}>`)
                }
                else if (userstats.level == 100) {
                    embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level100}> hai sbloccato nuove funzioni\r- **Priorità di parola** nelle chat vocali`)
                }

                var canale = await client.channels.cache.get(config.idCanaliServer.levelUp);
                await canale.send(button.clicker.user.toString() + ` hai raggiunto un **nuovo livello**`, embed2)
            } break
            case 6: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ecco a te i tuoi **300 punti xp**, controlla con \`!rank\` se hai superato un nuovo livello
                    `)

                userstats.xp += 300

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
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level5}>`)
                    }
                    else if (userstats.level == 5) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level5}> hai sbloccato nuove funzioni\r- **Streaming** nelle chat vocali\r- Aggiungere **reazioni** ai messaggi\r- Allegare **file** nelle chat testuali\r- Creare **stanze private** testuali`)
                    }
                    else if (userstats.level < 10) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level10}>`)
                    }
                    else if (userstats.level == 10) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level10}> hai sbloccato nuove funzioni\r- Mandare **emoji esterne**\r- Creare **stanze private** vocali`)
                    }
                    else if (userstats.level < 15) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level15}>`)
                    }
                    else if (userstats.level == 15) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level15}> hai sbloccato nuove funzioni\r- Scrivere in chat <#${config.idCanaliServer.noMicChat}> per utilizzare <@414925323197612032>\r- Cambiare il proprio **nickname**\r- Utilizzare il comando **!say**`)
                    }
                    else if (userstats.level < 20) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level20}>`)
                    }
                    else if (userstats.level == 20) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level20}> hai sbloccato nuove funzioni\r- Creare **stanze private** tesuali + vocali`)
                    }
                    else if (userstats.level < 25) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level25}>`)
                    }
                    else if (userstats.level == 25) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level25}> hai sbloccato nuove funzioni\r- 10% di **Boost** di esperienza nel livellamento`)
                    }
                    else if (userstats.level < 30) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level30}>`)
                    }
                    else if (userstats.level == 30) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level30}> hai sbloccato nuove funzioni\r- Scrivere nella chat <#${config.idCanaliServer.selfAdv}>`)
                    }
                    else if (userstats.level < 50) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level50}>`)
                    }
                    else if (userstats.level == 50) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level50}> hai sbloccato nuove funzioni\r- 20% di **Boost** di esperienza nel livellamento`)
                    }
                    else if (userstats.level < 100) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level100}>`)
                    }
                    else if (userstats.level == 100) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level100}> hai sbloccato nuove funzioni\r- **Priorità di parola** nelle chat vocali`)
                    }

                    var canale = await client.channels.cache.get(config.idCanaliServer.levelUp);
                    await canale.send(button.clicker.user.toString() + ` hai raggiunto un **nuovo livello**`, embed2)
                }
            } break
            case 7: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
In realtà ancora non hai ottenuto nessun privilegio, ma questo **regalo misterioso** super figo verrà svelato con il prossimo **Changelog** del 15/01
                `)
            } break
            case 8: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ecco a te i tuoi **500 punti xp**, controlla con \`!rank\` se hai superato un nuovo livello
                    `)

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
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level5}>`)
                    }
                    else if (userstats.level == 5) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level5}> hai sbloccato nuove funzioni\r- **Streaming** nelle chat vocali\r- Aggiungere **reazioni** ai messaggi\r- Allegare **file** nelle chat testuali\r- Creare **stanze private** testuali`)
                    }
                    else if (userstats.level < 10) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level10}>`)
                    }
                    else if (userstats.level == 10) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level10}> hai sbloccato nuove funzioni\r- Mandare **emoji esterne**\r- Creare **stanze private** vocali`)
                    }
                    else if (userstats.level < 15) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level15}>`)
                    }
                    else if (userstats.level == 15) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level15}> hai sbloccato nuove funzioni\r- Scrivere in chat <#${config.idCanaliServer.noMicChat}> per utilizzare <@414925323197612032>\r- Cambiare il proprio **nickname**\r- Utilizzare il comando **!say**`)
                    }
                    else if (userstats.level < 20) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level20}>`)
                    }
                    else if (userstats.level == 20) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level20}> hai sbloccato nuove funzioni\r- Creare **stanze private** tesuali + vocali`)
                    }
                    else if (userstats.level < 25) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level25}>`)
                    }
                    else if (userstats.level == 25) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level25}> hai sbloccato nuove funzioni\r- 10% di **Boost** di esperienza nel livellamento`)
                    }
                    else if (userstats.level < 30) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level30}>`)
                    }
                    else if (userstats.level == 30) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level30}> hai sbloccato nuove funzioni\r- Scrivere nella chat <#${config.idCanaliServer.selfAdv}>`)
                    }
                    else if (userstats.level < 50) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level50}>`)
                    }
                    else if (userstats.level == 50) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level50}> hai sbloccato nuove funzioni\r- 20% di **Boost** di esperienza nel livellamento`)
                    }
                    else if (userstats.level < 100) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level100}>`)
                    }
                    else if (userstats.level == 100) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level100}> hai sbloccato nuove funzioni\r- **Priorità di parola** nelle chat vocali`)
                    }

                    var canale = await client.channels.cache.get(config.idCanaliServer.levelUp);
                    await canale.send(button.clicker.user.toString() + ` hai raggiunto un **nuovo livello**`, embed2)
                }
            } break
            case 9: {
                var freddure = serverstats.freddure
                if (serverstats.avvento[button.clicker.user.id].freddura2)
                    freddure = serverstats.freddure.filter(x => x != serverstats.avvento[button.clicker.user.id].freddura2)
                var freddura = freddure[Math.floor(Math.random() * freddure.length)]

                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ecco una barzella **super divertente**, credo...
                `)
                    .setImage(freddura)
                    .setFooter("Battuta by Legolize")

                serverstats.avvento[button.clicker.user.id].freddura1 = freddura
            } break
            case 10: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Diventa un piccolo Babbo Natale per un giorno. Utilizza il comando \`!regalaxp [user]\` e fai un piccolo **regalo** a qualcuno
                `)
            } break
            case 11: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ottimo, ora una tua stanza potrà essere **accessibile** a tutti. Dopo aver creato il tuo **canale privato** utilizza il comando \`!punlock\` per renderla pubblica
Potrai quando vuoi renderla privata con \`!plock\`
_PS Il 06/01 la stanza verrà resa privata_
                `)
            } break
            case 12: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Tutti i tuoi errori in Counting sono stati **resettati**. Mi raccomando ora non sbagliare più eh...
                `)

                userstats.incorrect = 0;
            } break
            case 13: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ecco a te i tuoi **700 punti xp**, controlla con \`!rank\` se hai superato un nuovo livello
                    `)

                userstats.xp += 700

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
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level5}>`)
                    }
                    else if (userstats.level == 5) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level5}> hai sbloccato nuove funzioni\r- **Streaming** nelle chat vocali\r- Aggiungere **reazioni** ai messaggi\r- Allegare **file** nelle chat testuali\r- Creare **stanze private** testuali`)
                    }
                    else if (userstats.level < 10) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level10}>`)
                    }
                    else if (userstats.level == 10) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level10}> hai sbloccato nuove funzioni\r- Mandare **emoji esterne**\r- Creare **stanze private** vocali`)
                    }
                    else if (userstats.level < 15) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level15}>`)
                    }
                    else if (userstats.level == 15) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level15}> hai sbloccato nuove funzioni\r- Scrivere in chat <#${config.idCanaliServer.noMicChat}> per utilizzare <@414925323197612032>\r- Cambiare il proprio **nickname**\r- Utilizzare il comando **!say**`)
                    }
                    else if (userstats.level < 20) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level20}>`)
                    }
                    else if (userstats.level == 20) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level20}> hai sbloccato nuove funzioni\r- Creare **stanze private** tesuali + vocali`)
                    }
                    else if (userstats.level < 25) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level25}>`)
                    }
                    else if (userstats.level == 25) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level25}> hai sbloccato nuove funzioni\r- 10% di **Boost** di esperienza nel livellamento`)
                    }
                    else if (userstats.level < 30) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level30}>`)
                    }
                    else if (userstats.level == 30) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level30}> hai sbloccato nuove funzioni\r- Scrivere nella chat <#${config.idCanaliServer.selfAdv}>`)
                    }
                    else if (userstats.level < 50) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level50}>`)
                    }
                    else if (userstats.level == 50) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level50}> hai sbloccato nuove funzioni\r- 20% di **Boost** di esperienza nel livellamento`)
                    }
                    else if (userstats.level < 100) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level100}>`)
                    }
                    else if (userstats.level == 100) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level100}> hai sbloccato nuove funzioni\r- **Priorità di parola** nelle chat vocali`)
                    }

                    var canale = await client.channels.cache.get(config.idCanaliServer.levelUp);
                    await canale.send(button.clicker.user.toString() + ` hai raggiunto un **nuovo livello**`, embed2)
                }
            } break
            case 14: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Utilizza ora in tutto il server queste due nuove fighissime **emoji** a tema **natalizio**
_PS Riavvia Discord nel caso non le vedessi nell'elenco delle emoji disponibili_
                `)
                    .setImage("https://i.postimg.cc/zBVcDXW9/Emoji-Natale1.png")

                button.clicker.member.roles.add("909817256769380412")
            } break
            case 15: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ecco a te i tuoi **1000 punti xp**, controlla con \`!rank\` se hai superato un nuovo livello
                    `)

                userstats.xp += 1000

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
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level5}>`)
                    }
                    else if (userstats.level == 5) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level5}> hai sbloccato nuove funzioni\r- **Streaming** nelle chat vocali\r- Aggiungere **reazioni** ai messaggi\r- Allegare **file** nelle chat testuali\r- Creare **stanze private** testuali`)
                    }
                    else if (userstats.level < 10) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level10}>`)
                    }
                    else if (userstats.level == 10) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level10}> hai sbloccato nuove funzioni\r- Mandare **emoji esterne**\r- Creare **stanze private** vocali`)
                    }
                    else if (userstats.level < 15) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level15}>`)
                    }
                    else if (userstats.level == 15) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level15}> hai sbloccato nuove funzioni\r- Scrivere in chat <#${config.idCanaliServer.noMicChat}> per utilizzare <@414925323197612032>\r- Cambiare il proprio **nickname**\r- Utilizzare il comando **!say**`)
                    }
                    else if (userstats.level < 20) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level20}>`)
                    }
                    else if (userstats.level == 20) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level20}> hai sbloccato nuove funzioni\r- Creare **stanze private** tesuali + vocali`)
                    }
                    else if (userstats.level < 25) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level25}>`)
                    }
                    else if (userstats.level == 25) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level25}> hai sbloccato nuove funzioni\r- 10% di **Boost** di esperienza nel livellamento`)
                    }
                    else if (userstats.level < 30) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level30}>`)
                    }
                    else if (userstats.level == 30) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level30}> hai sbloccato nuove funzioni\r- Scrivere nella chat <#${config.idCanaliServer.selfAdv}>`)
                    }
                    else if (userstats.level < 50) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level50}>`)
                    }
                    else if (userstats.level == 50) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level50}> hai sbloccato nuove funzioni\r- 20% di **Boost** di esperienza nel livellamento`)
                    }
                    else if (userstats.level < 100) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level100}>`)
                    }
                    else if (userstats.level == 100) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level100}> hai sbloccato nuove funzioni\r- **Priorità di parola** nelle chat vocali`)
                    }

                    var canale = await client.channels.cache.get(config.idCanaliServer.levelUp);
                    await canale.send(button.clicker.user.toString() + ` hai raggiunto un **nuovo livello**`, embed2)
                }
            } break
            case 16: {
                var spoiler = serverstats.spoiler[Math.floor(Math.random() * serverstats.spoiler.length)]

                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ecco a te un piccolo spoiler sul prossimo **Changelog**, sarà fantanstico e pieno di **novità**
                `)
                    .setImage(spoiler)
            } break
            case 17: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ora potrai usare qualsiasi **comando** (_tranne il !say_) in qualsiasi chat nel server fino al 06/01
                `)
                    .setImage(spoiler)
            } break
            case 18: {
                var freddure = serverstats.freddure
                if (serverstats.avvento[button.clicker.user.id].freddura1)
                    freddure = serverstats.freddure.filter(x => x != serverstats.avvento[button.clicker.user.id].freddura1)
                var freddura = freddure[Math.floor(Math.random() * freddure.length)]

                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ecco una barzella **super divertente**, credo...
                `)
                    .setImage(freddura)
                    .setFooter("Battuta by Legolize")

                serverstats.avvento[button.clicker.user.id].freddura2 = freddura
            } break
            case 19: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ora hai due livelli in più. Scopri in <#${config.idCanaliServer.levelUp}> se hai ottenuto fantastici **privilegi**
                    `)

                userstats.level += 2
                userstats.xp = calcoloXpNecessario(userstats.level)

                const levelColor = require("../../config/levelColor.json")

                var embed2 = new Discord.MessageEmbed()
                    .setTitle("LEVEL " + userstats.level)
                    .setColor(levelColor[userstats.level])

                if (userstats.level < 5) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level5}>`)
                }
                else if (userstats.level == 5) {
                    embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level5}> hai sbloccato nuove funzioni\r- **Streaming** nelle chat vocali\r- Aggiungere **reazioni** ai messaggi\r- Allegare **file** nelle chat testuali\r- Creare **stanze private** testuali`)
                }
                else if (userstats.level < 10) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level10}>`)
                }
                else if (userstats.level == 10) {
                    embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level10}> hai sbloccato nuove funzioni\r- Mandare **emoji esterne**\r- Creare **stanze private** vocali`)
                }
                else if (userstats.level < 15) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level15}>`)
                }
                else if (userstats.level == 15) {
                    embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level15}> hai sbloccato nuove funzioni\r- Scrivere in chat <#${config.idCanaliServer.noMicChat}> per utilizzare <@414925323197612032>\r- Cambiare il proprio **nickname**\r- Utilizzare il comando **!say**`)
                }
                else if (userstats.level < 20) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level20}>`)
                }
                else if (userstats.level == 20) {
                    embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level20}> hai sbloccato nuove funzioni\r- Creare **stanze private** tesuali + vocali`)
                }
                else if (userstats.level < 25) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level25}>`)
                }
                else if (userstats.level == 25) {
                    embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level25}> hai sbloccato nuove funzioni\r- 10% di **Boost** di esperienza nel livellamento`)
                }
                else if (userstats.level < 30) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level30}>`)
                }
                else if (userstats.level == 30) {
                    embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level30}> hai sbloccato nuove funzioni\r- Scrivere nella chat <#${config.idCanaliServer.selfAdv}>`)
                }
                else if (userstats.level < 50) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level50}>`)
                }
                else if (userstats.level == 50) {
                    embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level50}> hai sbloccato nuove funzioni\r- 20% di **Boost** di esperienza nel livellamento`)
                }
                else if (userstats.level < 100) {
                    embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level100}>`)
                }
                else if (userstats.level == 100) {
                    embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level100}> hai sbloccato nuove funzioni\r- **Priorità di parola** nelle chat vocali`)
                }

                var canale = await client.channels.cache.get(config.idCanaliServer.levelUp);
                await canale.send(button.clicker.user.toString() + ` hai raggiunto un **nuovo livello**`, embed2)
            } break
            case 20: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Utilizza ora in tutto il server queste due nuove fighissime **emoji** a tema **natalizio**
_PS Riavvia Discord nel caso non le vedessi nell'elenco delle emoji disponibili_
                `)
                    .setImage("https://i.postimg.cc/GtDgY7XK/Emoji-Natale2.png")

                button.clicker.member.roles.add("909817687260139520")

            } break
            case 21: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Boost **x3** attivato, ora per le prossime **12h** per ogni messaggio riceverai dai 45 ai 120 punti
                `)

                serverstats.avvento[button.clicker.user.id].boost3 = new Date().getTime()
            } break
            case 22: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Utilizza ora in tutto il server queste due nuove fighissime **emoji** a tema **capodanno**
_PS Riavvia Discord nel caso non le vedessi nell'elenco delle emoji disponibili_
                `)
                    .setImage("https://i.postimg.cc/0QFHzR0r/Emoji-Capodanno.png")

                button.clicker.member.roles.add("910625247131209778")
            } break
            case 23: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
È ora di diventare un piccolo Grinch. Utilizza il comando \`!toglixp [user]\` e fai un piccolo **dispetto** a qualcuno
_PS Questi punti rimossi dall'utente non verranno addebitati a te_
                `)
            } break
            case 24: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ecco a te una **cartolina** per fare gli auguri di buon natale in modo **originale** a tutta la tua famiglia o a tutti i tuoi amici
                `)
                    .setImage("https://i.postimg.cc/MGyGDg8b/1.png")
            } break
            case 25: {
                embed
                    .addField("<:opengift2:914090991110225931> Ricompensa ottenuta", `
Ecco a te i tuoi **5000 punti xp** per questo super regalo di natale, controlla con \`!rank\` se hai superato un nuovo livello
                    `)

                userstats.xp += 5000

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
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level5}>`)
                    }
                    else if (userstats.level == 5) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level5}> hai sbloccato nuove funzioni\r- **Streaming** nelle chat vocali\r- Aggiungere **reazioni** ai messaggi\r- Allegare **file** nelle chat testuali\r- Creare **stanze private** testuali`)
                    }
                    else if (userstats.level < 10) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level10}>`)
                    }
                    else if (userstats.level == 10) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level10}> hai sbloccato nuove funzioni\r- Mandare **emoji esterne**\r- Creare **stanze private** vocali`)
                    }
                    else if (userstats.level < 15) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level15}>`)
                    }
                    else if (userstats.level == 15) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level15}> hai sbloccato nuove funzioni\r- Scrivere in chat <#${config.idCanaliServer.noMicChat}> per utilizzare <@414925323197612032>\r- Cambiare il proprio **nickname**\r- Utilizzare il comando **!say**`)
                    }
                    else if (userstats.level < 20) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level20}>`)
                    }
                    else if (userstats.level == 20) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level20}> hai sbloccato nuove funzioni\r- Creare **stanze private** tesuali + vocali`)
                    }
                    else if (userstats.level < 25) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level25}>`)
                    }
                    else if (userstats.level == 25) {
                        embed2.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level25}> hai sbloccato nuove funzioni\r- 10% di **Boost** di esperienza nel livellamento`)
                    }
                    else if (userstats.level < 30) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level30}>`)
                    }
                    else if (userstats.level == 30) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level30}> hai sbloccato nuove funzioni\r- Scrivere nella chat <#${config.idCanaliServer.selfAdv}>`)
                    }
                    else if (userstats.level < 50) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level50}>`)
                    }
                    else if (userstats.level == 50) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level50}> hai sbloccato nuove funzioni\r- 20% di **Boost** di esperienza nel livellamento`)
                    }
                    else if (userstats.level < 100) {
                        embed2.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level100}>`)
                    }
                    else if (userstats.level == 100) {
                        embed2.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level100}> hai sbloccato nuove funzioni\r- **Priorità di parola** nelle chat vocali`)
                    }

                    var canale = await client.channels.cache.get(config.idCanaliServer.levelUp);
                    await canale.send(button.clicker.user.toString() + ` hai raggiunto un **nuovo livello**`, embed2)
                }
            } break
        }

        serverstats.avvento[button.clicker.user.id][numGiorno] = true
        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats

        var button1 = new disbut.MessageButton()
            .setLabel("Ritorna all'avvento")
            .setID("ritornaAvvento")
            .setStyle("red")

        button.message.edit(embed, button1)
    },
};