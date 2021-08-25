const Discord = require("discord.js");

module.exports = {
    name: `message`,
    async execute(message) {
        if (message.author.bot) return
        if (message.channel.type == "dm") return

        const { database, db } = await getDatabase()
        await database.collection("userstats").find().toArray(async function (err, result) {
            if (err) return codeError(err);
            var userstatsList = result;

            var userstats = userstatsList.find(x => x.id == message.author.id);
            if (!userstats) return

            if (new Date().getTime() - userstats.cooldownXp > 60000) {
                var boost = 0;
                if (message.member.roles.cache.has(config.ruoliLeveling.level25)) {
                    boost = 10;
                }
                if (message.member.roles.cache.has(config.ruoliLeveling.level50)) {
                    boost = 20;
                }

                userstats.cooldownXp = new Date().getTime();
                var xp = Math.floor(Math.random() * (40 - 15 + 1)) + 15;
                userstats.xp = parseInt(userstats.xp) + xp + (boost * xp / 100);

                if (userstats.xp >= calcoloXpNecessario(userstats.level + 1)) {

                    await userstats.level++;

                    const levelColor = require("../../config/levelColor.json")

                    var embed = new Discord.MessageEmbed()
                        .setTitle("LEVEL " + userstats.level)
                        .setColor(levelColor[userstats.level])

                    if (userstats.level < 5) {
                        embed.setDescription("Sblocca **nuovi privilegi** al <@&799990260393443338>")
                    }
                    else if (userstats.level == 5) {
                        embed.addField("Nuovi privilegi", "Con il <@&799990260393443338> hai sbloccato nuove funzioni\r- **Streaming** nelle chat vocali\r- Aggiungere **reazioni** ai messaggi\r- Allegare **file** nelle chat testuali")
                    }
                    else if (userstats.level < 10) {
                        embed.setDescription("Sblocca **nuovi privilegi** al <@&799990705216159791>")
                    }
                    else if (userstats.level == 10) {
                        embed.addField("Nuovi privilegi", "Con il <@&799990705216159791> hai sbloccato nuove funzioni\r- Mandare **emoji esterne**\r- Utilizzare il comando **!say**")
                    }
                    else if (userstats.level < 15) {
                        embed.setDescription("Sblocca **nuovi privilegi** al <@&799990735839559690>")
                    }
                    else if (userstats.level == 15) {
                        embed.addField("Nuovi privilegi", "Con il <@&799990735839559690> hai sbloccato nuove funzioni\r- Scrivere in chat <#801483778899968020> per utilizzare <@414925323197612032>\r- Cambiare il proprio **nickname**\rPoter creare **stanze private** in <#801455964711813150>")
                    }
                    else if (userstats.level < 25) {
                        embed.setDescription("Sblocca **nuovi privilegi** al <@&799990806357213194>")
                    }
                    else if (userstats.level == 25) {
                        embed.addField("Nuovi privilegi", "Con il <@&799990806357213194> hai sbloccato nuove funzioni\r- 10% di **Boost** di esperienza nel livellamento")
                    }
                    else if (userstats.level < 30) {
                        embed.setDescription("Sblocca **nuovi privilegi** al <@&799990832224272405>")
                    }
                    else if (userstats.level == 30) {
                        embed.addField("Nuovi privilegi", "Con il <@&799990832224272405> hai sbloccato nuove funzioni\r- Scrivere nella chat <#801379978045816863>")
                    }
                    else if (userstats.level < 50) {
                        embed.setDescription("Sblocca **nuovi privilegi** al <@&800740473437945927>")
                    }
                    else if (userstats.level == 50) {
                        embed.addField("Nuovi privilegi", "Con il <@&800740473437945927> hai sbloccato nuove funzioni\r- 20% di **Boost** di esperienza nel livellamento")
                    }
                    else if (userstats.level < 100) {
                        embed.setDescription("Sblocca **nuovi privilegi** al <@&800740873351462932>")
                    }
                    else if (userstats.level == 100) {
                        embed.addField("Nuovi privilegi", "Con il <@&800740873351462932> hai sbloccato nuove funzioni\r- **Priorità di parola** nelle chat vocali")
                    }

                    var canale = await client.channels.cache.get(config.idCanaliServer.levelUp);
                    await canale.send(message.author.toString() + " hai raggiunto un **nuovo livello**", embed)
                }

                database.collection("userstats").updateOne({ id: userstats.id }, { $set: userstats });
                setLevelRole(message.member, userstats.level)
            }
            await db.close()
        })
    },
};