module.exports = {
    name: `voiceStateUpdate`,
    async execute(oldMember, newMember) {
        if (isMaintenance(newMember.id)) return

        if (!oldMember.channelId && newMember.channelId && new Date().getDate() >= 16 && new Date().getDate() <= 24) {
            if (!joinVocalChat[newMember.id]) {
                joinVocalChat[newMember.id] = {
                    id: newMember.id,
                    count: 0,
                    time: new Date().getTime()
                }
            }

            if (new Date().getTime() - joinVocalChat[newMember.id].time > 60000) {
                joinVocalChat[newMember.id].count = 1
            }
            else {
                joinVocalChat[newMember.id].count++
            }
            joinVocalChat[newMember.id].time = new Date().getTime()

            console.log(joinVocalChat[newMember.id])
            if (joinVocalChat[newMember.id].count >= 5 && !serverstats.easter.find(x => x.id == newMember.id)?.codes["6"]) {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Hai scoperto un codice")
                    .setColor("#EF7A98")
                    .setDescription("Bravo, sei riuscito a risolvere l'indovinello e trovare il codice segreto:\r:point_right: `K2SUO`\r\rRiscattalo subito con il comando `!eastercode`")

                client.users.cache.get(newMember.id).send({ embeds: [embed] })
                    .catch(() => { })
            }
        }

        //Kick dai canali stats
        if (newMember.channelId == settings.idCanaliServer.codeSubscriberCounter || newMember.channelId == settings.idCanaliServer.giulioSubscriberCounter || newMember.channelId == settings.idCanaliServer.memberCounter) {
            var server = client.guilds.cache.get(settings.idServer);
            var utente = server.members.cache.find(x => x.id == newMember.id);
            utente.voice.kick()
        }

        if (oldMember.guild.id != settings.idServer) return

        //Canale no-mic-chat
        if (!oldMember.channelId && newMember.channelId) {
            var utente = client.guilds.cache.get(settings.idServer).members.cache.get(newMember.id)
            if (utente.bot) return
            if (utente) utente.roles.add(settings.idRuoloNoMicChat)
        }
        if (oldMember.channelId && !newMember.channelId) {
            var utente = client.guilds.cache.get(settings.idServer).members.cache.get(newMember.id)
            if (utente.bot) return
            if (utente) utente.roles.remove(settings.idRuoloNoMicChat)
        }
    },
};