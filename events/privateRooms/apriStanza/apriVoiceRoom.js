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
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (interaction.customId != "apriVoiceRoom") return

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        let userstats = await getUser(interaction.user.id)
        if (!userstats) userstats = await addUser(interaction.member)

        if (!hasSufficientLevels(client, userstats, 20)) {
            return replyMessage(client, interaction, "InsufficientLevel", "Non ha il livello", `Per aprire una **stanza privata vocale** devi avere almeno il ${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == "Level 20").toString()} o **boostare** il server`)
        }

        if (userstats.moderation.type == "Muted" || userstats.moderation.type == "Tempmuted") {
            return replyMessage(client, interaction, "Warning", "Non puoi aprire una stanza se sei mutato", `Non ti è concesso creare una qualsiasi stanza privata se sei mutato`)
        }

        let serverstats = await getServer()
        let privaterooms = serverstats.privateRooms

        if (privaterooms.find((x) => x.type == 'voice' && x.owners.includes(interaction.user.id))) {
            return replyMessage(client, interaction, "Warning", "Stanza vocale già aperta", "Puoi aprire solo una stanza vocale alla volta")
        }

        let server = client.guilds.cache.get(settings.idServer);
        server.channels.create(`🔊│${interaction.user.username}-voice`, {
            type: "GUILD_VOICE",
            permissionOverwrites: [
                {
                    id: interaction.message.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL'],
                },
                {
                    id: settings.ruoliStaff.moderatore,
                    allow: ['VIEW_CHANNEL']
                }
            ],
            parent: client.channels.cache.get(interaction.channelId).parentId,
        })
            .then(async channel => {
                await interaction.deferUpdate()
                    .catch(() => { })

                serverstats.privateRooms.push({
                    channel: channel.id,
                    owners: [interaction.user.id],
                    type: "voice",
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
                    .addField(":placard: Type", `Voice`)

                const maintenanceStatus = await isMaintenance()
                if (!maintenanceStatus)
                    client.channels.cache.get(log.community.privateRooms).send({ embeds: [embed] })
            })
            .catch(() => {
                return replyMessage(client, interaction, "Warning", "Troppe stanze", "Sono state create più di **50 stanze** in questa categoria. Discord non permette al bot di crearne di più, riprova più tardi")
            })
    },
};