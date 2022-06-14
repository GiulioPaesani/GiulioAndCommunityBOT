const Discord = require("discord.js")
const moment = require("moment")
const log = require("../../../config/general/log.json")
const settings = require("../../../config/general/settings.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");
const { replyMessage } = require("../../../functions/general/replyMessage");
const { updateServer } = require("../../../functions/database/updateServer");
const { getUser } = require("../../../functions/database/getUser")
const { addUser } = require("../../../functions/database/addUser")
const { hasSufficientLevels } = require("../../../functions/leveling/hasSufficientLevels")

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (interaction.customId != "apriTextRoom") return

        if (isMaintenance(interaction.user.id)) return

        let userstats = getUser(interaction.user.id)
        if (!userstats) userstats = addUser(interaction.member)[0]

        if (!hasSufficientLevels(client, userstats, 10)) {
            return replyMessage(client, interaction, "InsufficientLevel", "Non ha il livello", `Per aprire una **stanza privata testuale** devi avere almeno il ${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == "Level 10").toString()} o **boostare** il server`)
        }

        if (userstats.moderation.type == "Muted" || userstats.moderation.type == "Tempmuted") {
            return replyMessage(client, interaction, "Warning", "Non puoi aprire una stanza se sei mutato", `Non ti è concesso creare una qualsiasi stanza privata se sei mutato`)
        }

        let serverstats = getServer()
        let privaterooms = serverstats.privateRooms

        if (privaterooms.find((x) => x.type == 'text' && x.owners.includes(interaction.user.id))) {
            return replyMessage(client, interaction, "Warning", "Stanza testuale già aperta", "Puoi aprire solo una stanza testuale alla volta")
        }

        let server = client.guilds.cache.get(settings.idServer);
        server.channels.create(`💬│${interaction.user.username}-text`, {
            type: "GUILD_TEXT",
            permissionOverwrites: [
                {
                    id: interaction.message.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES'],
                },
                {
                    id: settings.ruoliStaff.moderatore,
                    allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES']
                }
            ],
            parent: client.channels.cache.get(interaction.channelId).parentId,
            topic: `Text room by **${interaction.user.username}**`
        })
            .then(channel => {
                interaction.deferUpdate()
                    .catch(() => { })

                let embed = new Discord.MessageEmbed()
                    .setTitle(":closed_lock_with_key: Private room :closed_lock_with_key:")
                    .setColor("#FFAC33")
                    .addField("Tutti i comandi", `
Per ogni comando è necessario specificare a quali stanza si vuole applicare
- \`/pdelete\` - **Eliminare** la stanza
- \`/padd\` - **Aggiungere** un utente alla stanza privata
- \`/premove\` - **Rimuovere** un utente dalla stanza privata
- \`/pkick\` - **Kickare** un utente dalla stanza vocale (Potrà **rientrare** quando vuole)
- \`/prename\` - **Rinominare** la stanza
- \`/pleave\` - **Uscire** da una stanza di un altro utente
- \`/ptopic\` - Impostare un nuovo **topic** alla stanza (Solo per stanze testuali)
- \`/pmode\` - Scegliere cosa gli utenti **possono** o **non possono** mandare nella tua stanza
- \`/pinvite\` - Creare un messaggio di **invito** con cui gli utenti possono entrare in maniera semplice nella stanza
- \`/padmin\` - Aggiungere o rimuovere un utente come **admin** della stanza
- \`/pinfo\` - Ottenere tutte le **informazioni** di una stanza
`)

                channel.send(`<@${interaction.user.id}> ecco al tua stanza testuale!`)
                    .then(msg => msg.delete().catch(() => { }))
                channel.send({ embeds: [embed] })

                serverstats.privateRooms.push({
                    channel: channel.id,
                    owners: [interaction.user.id],
                    type: "text",
                    mode: {
                        messages: true,
                        emoji: true,
                        sticker: true,
                        gif: true,
                        image: true,
                        video: true,
                        file: true
                    },
                    lastActivity: new Date().getTime(),
                    lastActivityCount: 0,
                    daEliminare: false
                })

                updateServer(serverstats)

                embed = new Discord.MessageEmbed()
                    .setTitle(":envelope_with_arrow: Room opened :envelope_with_arrow:")
                    .setColor(colors.green)
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                    .addField(":bust_in_silhouette: Owner", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
                    .addField(":placard: Type", `Text`)

                if (!isMaintenance())
                    client.channels.cache.get(log.community.privateRooms).send({ embeds: [embed] })
            })
            .catch(() => {
                return replyMessage(client, interaction, "Warning", "Troppe stanze", "Sono state create più di **50 stanze** in questa categoria. Discord non permette al bot di crearne di più, riprova più tardi")
            })
    },
};