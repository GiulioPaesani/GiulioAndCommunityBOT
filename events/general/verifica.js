module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (button.id == "verifica") {
            if (userstatsList.find(x => x.id == button.clicker.user.id)) return

            if (button.clicker.member.roles.cache.has(config.idRuoloNonVerificato))
                button.clicker.member.roles.remove(config.idRuoloNonVerificato)

            var server = client.guilds.cache.get(config.idServer);
            var botCount = server.members.cache.filter(member => member.user.bot).size;
            var utentiCount = server.memberCount - botCount;

            var canale = client.channels.cache.get(config.idCanaliServer.welcome)
            canale.send(`
----- 𝐍𝐔𝐎𝐕𝐎 𝐌𝐄𝐌𝐁𝐑𝐎 -----
:call_me: Ciao ${button.clicker.member.toString()}, benvenuto in **GiulioAndCommunity**
:eyes: Sei il **${utentiCount}° Membro**
:scroll: Prima di fare altro, leggi le <#${config.idCanaliServer.rules}>
:rotating_light: Puoi vedere tutte le informazioni sul server in <#${config.idCanaliServer.info}>`)

            var embed = new Discord.MessageEmbed()
                .setAuthor(`[WELCOME] ${button.clicker.member.user.username}#${button.clicker.member.user.discriminator}`, button.clicker.member.user.displayAvatarURL())
                .setThumbnail("https://i.postimg.cc/J73zF2Wj/Welcome.png")
                .setColor("#7AC943")
                .addField("Account created", moment(button.clicker.member.user.createdAt).fromNow())
                .setFooter(`User ID: ${button.clicker.user.id}`)

            var canale = client.channels.cache.get(config.idCanaliServer.log);
            canale.send(embed);

            var userstats = {
                id: button.clicker.member.id,
                username: button.clicker.member.user.username,
                roles: [],
                statistics: {
                    "totalMessage": 0,
                    "commands": 0,
                    "addReaction": 0,
                    "deleteMessage": 0,
                    "editMessage": 0
                },
                lastScore: 0,
                bestScore: 0,
                timeLastScore: null,
                timeBestScore: null,
                correct: 0,
                incorrect: 0,
                level: 0,
                xp: 0,
                cooldownXp: 0,
                warn: [],
                moderation: {
                    "type": "",
                    "since": "",
                    "until": "",
                    "reason": "",
                    "moderator": ""
                }
            }
            database.collection("userstats").insertOne(userstats);
            userstatsList.push(userstats)

            button.clicker.member.roles.add(config.ruoliNotification.announcements)
            button.clicker.member.roles.add(config.ruoliNotification.changelog)

            button.clicker.user.send(`
-------------:call_me: **BENVENUTO IN GiulioAndCommunity** :call_me:-------------
Ciao **${button.clicker.member.user.username}** benvenuto nel server di **GiulioAndCode**
In questo server potrai divertirti e parlare con tutta la community di Giulio
Prima di iniziare ti consiglio di leggere tutte le regole del server in <#${config.idCanaliServer.rules}> e tutte le info sui bot, canali, ruoli in <#${config.idCanaliServer.info}>

In questo server c'è un sistema di **notifiche** diviso in categorie:
:clipboard: Announcements - Notifiche di annunci importanti sul server/canale/bot
:newspaper: News - Notifiche di notizie un po' meno importanti
:pencil: Changelog - Notifiche di changelog delle modifiche mensili su bot/server
:computer: YouTube GiulioAndCode - Notifiche sui nuovi video che escono sul canale GiulioAndCode
:v: YouTube Giulio - Notifiche sui nuovi video che escono sul canale Giulio
Di default ogni utente gli vengono date le notifiche Announcements e Changelog, ma se fai \`!config\` nel server potrai decidere quali attivare e disattivare

Buon divertimento!
`)
                .catch(() => { })

        }
    },
};
