module.exports = {
    name: `message`,
    async execute(message) {
        if (message.author.bot) return
        if (message.channel.type == "dm") return
        if (message.guild.id != config.idServer) return
        if (!userstatsList) return

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
                    embed.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level5}>`)
                }
                else if (userstats.level == 5) {
                    embed.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level5}> hai sbloccato nuove funzioni\r- **Streaming** nelle chat vocali\r- Aggiungere **reazioni** ai messaggi\r- Allegare **file** nelle chat testuali\r- Creare **stanze private** testuali`)
                }
                else if (userstats.level < 10) {
                    embed.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level10}>`)
                }
                else if (userstats.level == 10) {
                    embed.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level10}> hai sbloccato nuove funzioni\r- Mandare **emoji esterne**\r- Creare **stanze private** vocali`)
                }
                else if (userstats.level < 15) {
                    embed.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level15}>`)
                }
                else if (userstats.level == 15) {
                    embed.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level15}> hai sbloccato nuove funzioni\r- Scrivere in chat <#${config.idCanaliServer.noMicChat}> per utilizzare <@414925323197612032>\r- Cambiare il proprio **nickname**\r- Utilizzare il comando **!say**`)
                }
                else if (userstats.level < 20) {
                    embed.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level20}>`)
                }
                else if (userstats.level == 20) {
                    embed.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level20}> hai sbloccato nuove funzioni\r- Creare **stanze private** tesuali + vocali`)
                }
                else if (userstats.level < 25) {
                    embed.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level25}>`)
                }
                else if (userstats.level == 25) {
                    embed.addField("Nuovi privilegi", `Con il <@&${config.ruoliLeveling.level25}> hai sbloccato nuove funzioni\r- 10% di **Boost** di esperienza nel livellamento`)
                }
                else if (userstats.level < 30) {
                    embed.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level30}>`)
                }
                else if (userstats.level == 30) {
                    embed.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level30}> hai sbloccato nuove funzioni\r- Scrivere nella chat <#${config.idCanaliServer.selfAdv}>`)
                }
                else if (userstats.level < 50) {
                    embed.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level50}>`)
                }
                else if (userstats.level == 50) {
                    embed.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level50}> hai sbloccato nuove funzioni\r- 20% di **Boost** di esperienza nel livellamento`)
                }
                else if (userstats.level < 100) {
                    embed.setDescription(`Sblocca **nuovi privilegi** al <@&${config.ruoliLeveling.level100}>`)
                }
                else if (userstats.level == 100) {
                    embed.addField(`Nuovi privilegi`, `Con il <@&${config.ruoliLeveling.level100}> hai sbloccato nuove funzioni\r- **Priorità di parola** nelle chat vocali`)
                }

                var canale = await client.channels.cache.get(config.idCanaliServer.levelUp);
                await canale.send(message.author.toString() + ` hai raggiunto un **nuovo livello**`, embed)
            }

            userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
            setLevelRole(message.member, userstats.level)
        }
    },
};