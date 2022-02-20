module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (button.customId != "voiceRoom") return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        var userstats = userstatsList.find(x => x.id == button.user.id);
        if (!userstats) return

        if (userstats.level < 10 && !button.member.roles.cache.has(settings.idRuoloServerBooster)) {
            botMessage(button.user, "Warning", "Non ha il livello", "Per aprire una **stanza privata vocale** devi avere almeno il **Level 10** o **boostare** il server")

            button.deferUpdate().catch(() => { })
            return
        }

        var privaterooms = serverstats.privateRooms

        if (privaterooms.find(x => x.owner == button.user.id)) {
            botMessage(button.user, "Warning", "Hai già una stanza", "Hai già una stanza privata aperta")

            button.deferUpdate().catch(() => { })
            return
        }

        button.message.guild.channels.create(`🔊│${button.user.username}-voice`, {
            type: "GUILD_VOICE",
            permissionOverwrites: [
                {
                    id: button.message.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: button.user.id,
                    allow: ['VIEW_CHANNEL'],
                },
                {
                    id: settings.ruoliModeration.banned,
                    deny: ['VIEW_CHANNEL']
                },
                {
                    id: settings.ruoliModeration.tempbanned,
                    deny: ['VIEW_CHANNEL']
                }
            ],
            parent: button.message.channel.parentId
        }).then(voice => {
            button.deferUpdate().catch(() => { })

            serverstats.privateRooms.push({
                "text": null,
                "voice": voice.id,
                "owner": button.user.id,
                "type": "onlyVoice",
                "bans": [],
                "lastActivity": new Date().getTime(),
                "lastActivityCount": 0
            })

            var embed = new Discord.MessageEmbed()
                .setTitle(":envelope_with_arrow: Room opened :envelope_with_arrow:")
                .setColor("#22c90c")
                .addField(":alarm_clock: Time", `${moment(button.channel.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":bust_in_silhouette: Owner", `${button.user.toString()} - ID: ${button.user.id}`)
                .addField("Type", `Voice`)

            if (!isMaintenance())
                client.channels.cache.get(log.community.privateRooms).send({ embeds: [embed] })
        }).catch(() => {
            botMessage(button.user, "Warning", "Troppe stanze", "Sono state create più di **50 stanze** in questa categoria. Discord non permette al bot di crearne di più, mi spiace...")
            button.deferUpdate().catch(() => { })
                .catch(() => { })
            return
        })
    },
};