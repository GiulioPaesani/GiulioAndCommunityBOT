module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (button.customId != "textvoiceRoom") return
        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        var userstats = userstatsList.find(x => x.id == button.user.id);
        if (!userstats) return

        if (userstats.level < 20 && !button.member.roles.cache.has(settings.idRuoloServerBooster)) {
            botMessage(button.user, "Warning", "Non ha il livello", "Per aprire una **stanza privata completa** devi avere almeno il **Level 20** o **boostare** il server")

            button.deferUpdate().catch(() => { })
            return
        }

        var privaterooms = serverstats.privateRooms

        if (privaterooms.find(x => x.owner == button.user.id)) {
            botMessage(button.user, "Warning", "Hai già una stanza", "Hai già una stanza privata aperta")

            button.deferUpdate().catch(() => { })
            return
        }

        button.message.guild.channels.create(`💬│${button.user.username}-text`, {
            type: "GUILD_TEXT",
            permissionOverwrites: [
                {
                    id: button.message.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: button.user.id,
                    allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
                },
                {
                    id: settings.ruoliModeration.muted,
                    deny: ["SEND_MESSAGES"]
                },
                {
                    id: settings.ruoliModeration.tempmuted,
                    deny: ["SEND_MESSAGES"]
                },
                {
                    id: settings.ruoliModeration.banned,
                    deny: ['VIEW_CHANNEL', "SEND_MESSAGES"]
                },
                {
                    id: settings.ruoliModeration.tempbanned,
                    deny: ['VIEW_CHANNEL', "SEND_MESSAGES"]
                }
            ],
            parent: button.message.channel.parentId,
            topic: `Text room by: ${button.user.username}`
        }).then(text => {
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

                var embed = new Discord.MessageEmbed()
                    .setTitle(":closed_lock_with_key: Private room :closed_lock_with_key:")
                    .setColor("#FFAC33")
                    .addField(":bookmark_tabs: Tutti i comandi", `
- \`!pdelete\` - **Eliminare** la stanza
- \`!padd [user]\` - **Aggiungere** un utente alla stanza privata
- \`!premove [user]\` - **Rimuovere** un utente dalla stanza privata
- \`!pkick [user]\` - **Kickare** un utente dalla stanza (Potrà **rientrare** quando vuole)
- \`!prename [name]\` - **Rinominare** la stanza (Se hai una stanza compresa di chat **testuale** + **vocale** dovrà invece utilizzare rispettivamente \`!ptrename\` e \`!pvrename\` in modo da **scegliere** quale canale rinominare)`)
                    .addField(":scroll: Regole", `
Ci sono alcune **regole** da seguire nelle tue stanze
- È vietato il **flood** e lo **spam**. Evitare di spammare messaggi ripetuti per ricevere esperienza
- Evitare la condivisione di immagini, contenuti o messaggi **NSFW**, con linguaggi sensibili o **violenti**
- Vietato lo spam di link **illeciti**, software o plugin **malevoli**
- Si applicano anche tutte le regole del server`)

                text.send(`<@${button.user.id}>`).then(msg => msg.delete().catch(() => { }))
                text.send({ embeds: [embed] })

                serverstats.privateRooms.push({
                    "text": text.id,
                    "voice": voice.id,
                    "owner": button.user.id,
                    "type": "textVoice",
                    "bans": [],
                    "lastActivity": new Date().getTime(),
                    "lastActivityCount": 0
                })

                var embed = new Discord.MessageEmbed()
                    .setTitle(":envelope_with_arrow: Room opened :envelope_with_arrow:")
                    .setColor("#22c90c")
                    .addField(":alarm_clock: Time", `${moment(button.channel.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":bust_in_silhouette: Owner", `${button.user.toString()} - ID: ${button.user.id}`)
                    .addField("Type", `Text + Voice`)

                if (!isMaintenance())
                    client.channels.cache.get(log.community.privateRooms).send({ embeds: [embed] })
            }).catch(() => {
                botMessage(button.user, "Warning", "Troppe stanze", "Sono state create più di **50 stanze** in questa categoria. Discord non permette al bot di crearne di più, mi spiace...")
                button.deferUpdate().catch(() => { })
                    .catch(() => { })
                return
            })
        }).catch(() => {
            botMessage(button.user, "Warning", "Troppe stanze", "Sono state create più di **50 stanze** in questa categoria. Discord non permette al bot di crearne di più, mi spiace...")
            button.deferUpdate().catch(() => { })
                .catch(() => { })
            return
        })
    },
};