module.exports = {
    name: `guildMemberAdd`,
    async execute(member) {
        if (member.user.bot) return
        if (member.guild.id != config.idServer) return

        if (!userstatsList.find(x => x.id == member.id)) {
            member.roles.add(config.idRuoloNonVerificato)
            return
        }

        //WELCOME MESSAGE
        var server = client.guilds.cache.get(config.idServer);
        var botCount = server.members.cache.filter(member => member.user.bot).size;
        var utentiCount = server.memberCount - botCount;

        var canale = client.channels.cache.get(config.idCanaliServer.welcome)
        canale.send(`
----- 𝐍𝐔𝐎𝐕𝐎 𝐌𝐄𝐌𝐁𝐑𝐎 -----
:call_me: Ciao ${member.toString()}, benvenuto in **GiulioAndCommunity**
:eyes: Sei il **${utentiCount}° Membro**
:scroll: Prima di fare altro, leggi le <#${config.idCanaliServer.rules}>
:rotating_light: Puoi vedere tutte le informazioni sul server in <#${config.idCanaliServer.info}>`)

        var embed = new Discord.MessageEmbed()
            .setAuthor(`[WELCOME] ${member.user.username}#${member.user.discriminator}`, member.user.displayAvatarURL())
            .setThumbnail("https://i.postimg.cc/J73zF2Wj/Welcome.png")
            .setColor("#7AC943")
            .addField("Account created", moment(member.user.createdAt).fromNow())
            .setFooter(`User ID: ${member.id}`)

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
            userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
        }

        if (elencoRuoli != "") {
            member.send(`
-------------:call_me: **Bentornato in GiulioAndCommunity** :call_me:-------------
Ciao **${member.user.username}** bentornato nel server di **GiulioAndCode**
In questo server potrai divertirti e parlare con tutta la community di Giulio
Prima di iniziare ti consiglio di leggere tutte le regole del server in <#${config.idCanaliServer.rules}> e tutte le info sui bot, canali, ruoli in <#${config.idCanaliServer.info}>

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
Prima di iniziare ti consiglio di leggere tutte le regole del server in <#${config.idCanaliServer.rules}> e tutte le info sui bot, canali, ruoli in <#${config.idCanaliServer.info}>

Buon divertimento!
`)
                .catch(() => { })
        }

        var canale = client.channels.cache.get(config.idCanaliServer.log);
        canale.send(embed);
    },
};
