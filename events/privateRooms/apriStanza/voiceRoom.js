module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (isMaintenance(button.clicker.user.id)) return

        if (button.id == "voiceRoom") {
            var userstats = userstatsList.find(x => x.id == button.clicker.user.id);
            if (!userstats) return

            if (userstats.level < 10 && !button.clicker.member.roles.cache.has(settings.idRuoloServerBooster)) {
                botMessage(button.clicker.user, "Warning", "Non ha il livello", "Per aprire una **stanza privata vocale** devi avere almeno il **Level 10** o **boostare** il server")

                button.reply.defer()
                return
            }

            var privaterooms = serverstats.privateRooms

            if (privaterooms.find(x => x.owner == button.clicker.user.id)) {
                botMessage(button.clicker.user, "Warning", "Hai già una stanza", "Hai già una stanza privata aperta")

                button.reply.defer()
                return
            }

            button.message.guild.channels.create(`🔊│${button.clicker.user.username}-voice`, {
                type: "voice",
                permissionOverwrites: [
                    {
                        id: button.message.guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: button.clicker.user.id,
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
                parent: button.message.channel.parentID
            }).then(voice => {
                button.reply.defer()

                serverstats.privateRooms.push({
                    "text": null,
                    "voice": voice.id,
                    "owner": button.clicker.user.id,
                    "type": "onlyVoice",
                    "bans": [],
                    "lastActivity": new Date().getTime(),
                    "lastActivityCount": 0
                })

                var embed = new Discord.MessageEmbed()
                    .setTitle(":envelope_with_arrow: Room opened :envelope_with_arrow:")
                    .setColor("#22c90c")
                    .addField(":alarm_clock: Time", `${moment(button.channel.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":bust_in_silhouette: Owner", `${button.clicker.user.toString()} - ID: ${button.clicker.user.id}`)
                    .addField("Type", `Voice`)

                if (!isMaintenance())
                    client.channels.cache.get(log.community.privateRooms).send(embed)
            }).catch(() => {
                botMessage(button.clicker.user, "Warning", "Troppe stanze", "Sono state create più di **50 stanze** in questa categoria. Discord non permette al bot di crearne di più, mi spiace...")
                button.reply.defer()
                    .catch(() => { })
                return
            })
        }
    },
};