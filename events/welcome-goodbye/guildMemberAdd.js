const Discord = require("discord.js");
const moment = require("moment")

module.exports = {
    name: `guildMemberAdd`,
    async execute(member) {
        if (member.user.bot) return
        if (member.guild.id != config.idServer) return

        const { database, db } = await getDatabase()
        await database.collection("userstats").find().toArray(async function (err, result) {
            if (err) return codeError(err);
            var userstatsList = result;

            //WELCOME MESSAGE
            var server = client.guilds.cache.get(config.idServer);
            var botCount = server.members.cache.filter(member => member.user.bot).size;
            var utentiCount = server.memberCount - botCount;

            var canale = client.channels.cache.get(config.idCanaliServer.welcome)
            canale.send(`
-------------- 𝐍𝐔𝐎𝐕𝐎 𝐌𝐄𝐌𝐁𝐑𝐎 --------------
:call_me: Ciao ${member.toString()}, benvenuto in **GiulioAndCommunity**
:eyes: Sei il **${utentiCount}° Membro**
:scroll: Prima di fare altro, leggi le <#793781895829258260>
:rotating_light: Puoi vedere tutte le informazioni sul server in <#869975174383009812>`)

            var embed = new Discord.MessageEmbed()
                .setAuthor(`[WELCOME] ${member.user.username}#${member.user.discriminator}`, member.user.avatarURL())
                .setThumbnail("https://i.postimg.cc/J73zF2Wj/Welcome.png")
                .setColor("#7AC943")
                .addField("Account created", moment(member.user.createdAt).fromNow())
                .setFooter(`User ID: ${member.id}`)

            if (!userstatsList.find(x => x.id == member.id)) {
                var userstats = {
                    id: member.id,
                    username: member.user.username,
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
                await database.collection("userstats").insertOne(userstats);

                await db.close()

                member.roles.add("815649916574629941")
                member.roles.add("815649625591382077")
                member.roles.add("826784690487951370")
                member.roles.add("857544584691318814")

                member.send(`
-------------:call_me: **BENVENUTO IN GiulioAndCommunity** :call_me:-------------
Ciao **${member.user.username}** benvenuto nel server di **GiulioAndCode**
In questo server potrai divertirti e parlare con tutta la community di Giulio
Prima di iniziare ti consiglio di leggere tutte le regole del server in <#793781895829258260> e tutte le info sui bot, canali, ruoli in <#793781897619570738>

In questo server c'è un sistema di **notifiche** diviso in categorie:
:clipboard: Announcements - Notifiche di annunci importanti sul server/canale/bot
:newspaper: News - Notifiche di notizie un po' meno importanti
:pencil: Changelog - Notifiche di changelog delle modifiche mensili su bot/server
:projector: YouTube - Notifiche sui nuovi video che uscono sul canale YouTube
Di default ogni utente ha tutte e quattro le notifiche attive, ma se fai \`!config\` nel server potrai decidere quali attivare e disattivare

Buon divertimento!
`)
                    .catch(() => { })
            }
            else {
                var userstats = userstatsList.find(x => x.id == member.id)

                var elencoRuoli = "";
                if (userstats.roles.length != 0) {
                    var oldRoles = ""
                    for (var i = 0; i < userstats.roles.length; i++) {
                        elencoRuoli += `${member.guild.roles.cache.get(userstats.roles[i]).name}\r`;
                        member.roles.add(userstats.roles[i]).catch()
                        oldRoles += `${member.guild.roles.cache.get(userstats.roles[i]).toString()}\r`
                    }
                    embed.addField("Old roles", oldRoles)
                    userstats.roles = [];
                    await database.collection("userstats").updateOne({ id: userstats.id }, { $set: userstats });

                    await db.close()
                }

                if (elencoRuoli != "") {
                    member.send(`
-------------:call_me: **Bentornato in GiulioAndCommunity** :call_me:-------------
Ciao **${member.user.username}** bentornato nel server di **GiulioAndCode**
In questo server potrai divertirti e parlare con tutta la community di Giulio
Prima di iniziare ti consiglio di leggere tutte le regole del server in <#793781895829258260> e tutte le info sui bot, canali, ruoli in <#793781897619570738>

Prima di uscire avevi dei ruoli, ecco a te, ora li hai di nuovo:
${elencoRuoli}

Buon divertimento!
`)
                        .catch(() => { })
                }
                else {
                    member.send(`
-------------:call_me: **Bentornato in GiulioAndCommunity** :call_me:-------------
Ciao **${member.user.username}** bentornato nel server di **GiulioAndCode**
In questo server potrai divertirti e parlare con tutta la community di Giulio
Prima di iniziare ti consiglio di leggere tutte le regole del server in <#793781895829258260> e tutte le info sui bot, canali, ruoli in <#793781897619570738>

Buon divertimento!
`)
                        .catch(() => { })
                }
            }

            var canale = client.channels.cache.get(config.idCanaliServer.log);
            canale.send(embed);
        })
    },
};
