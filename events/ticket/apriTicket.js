const Discord = require("discord.js")
const moment = require("moment")
const log = require("../../config/general/log.json")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const { isMaintenance } = require("../../functions/general/isMaintenance");
const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { updateServer } = require("../../functions/database/updateServer");
const { updateUser } = require("../../functions/database/updateUser");
const { getUser } = require("../../functions/database/getUser")
const { addUser } = require("../../functions/database/addUser")

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (interaction.customId != "apriTicket") return

        if (isMaintenance(interaction.user.id)) return

        let serverstats = getServer()
        if (interaction.channelId == settings.idCanaliServer.support) {
            if (serverstats.tickets.find((x) => x.type == 'Normal' && x.owner == interaction.user.id)) {
                return replyMessage(client, interaction, "Warning", "Ticket già aperto", "Puoi aprire un solo ticket alla volta")
            }

            let userstats = getUser(interaction.user.id)
            if (!userstats) userstats = addUser(interaction.member)[0]

            if (userstats.moderation.type == "Muted" || userstats.moderation.type == "Tempmuted") {
                return replyMessage(client, interaction, "Warning", "Non puoi aprire un ticket di supporto se sei mutato", `Se vuoi parlare con lo staff puoi aprire un ticket in <#${userstats.moderation.type == "Muted" ? settings.idCanaliServer.mutedTicket : settings.idCanaliServer.tempmutedTicket}>`)
            }

            let server = client.guilds.cache.get(settings.idServer);
            server.channels.create(`📩│${interaction.user.username}`, {
                type: "GUILD_TEXT",
                permissionOverwrites: [
                    {
                        id: server.id,
                        deny: ['VIEW_CHANNEL']
                    },
                    {
                        id: interaction.user.id,
                        allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES']
                    },
                    {
                        id: settings.ruoliStaff.moderatore,
                        allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES']
                    }
                ],
                parent: client.channels.cache.get(interaction.channelId).parentId
            })
                .then((canale) => {
                    interaction.deferUpdate()
                        .catch(() => { })

                    let embed = new Discord.MessageEmbed()
                        .setTitle(":envelope_with_arrow: TICKET aperto")
                        .setColor("#4b89db")
                        .setDescription(`Il ticket è stato **aperto**, ora puoi parlare con lo staff
                        
_Non è possibile chiedere aiuto nella programmazione nei ticket_`)

                    let button1 = new Discord.MessageButton()
                        .setLabel("Chiudi ticket")
                        .setStyle("DANGER")
                        .setCustomId("chiudiTicket")

                    let row = new Discord.MessageActionRow()
                        .addComponents(button1)

                    canale.send({ components: [row], embeds: [embed] })
                        .then((msg) => {
                            serverstats.tickets.push({
                                type: 'Normal',
                                channel: canale.id,
                                owner: interaction.user.id,
                                message: msg.id,
                                daEliminare: false,
                            })

                            updateServer(serverstats)
                        });

                    canale.send(`<@${interaction.user.id}> ecco il tuo ticket`)
                        .then((msg) => {
                            msg.delete().catch(() => { });
                        })

                    let embed2 = new Discord.MessageEmbed()
                        .setTitle(":envelope_with_arrow: Ticket opened :envelope_with_arrow:")
                        .setColor(colors.green)
                        .addField(":alarm_clock: Time", `${moment(interaction.channel.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}`)
                        .addField(":bust_in_silhouette: Owner", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
                        .addField(":placard: Type", `Normal`)

                    if (!isMaintenance())
                        client.channels.cache.get(log.community.ticket).send({ embeds: [embed2] })
                })
        }

        if (client.channels.cache.get(interaction.channelId).parentId == settings.idCanaliServer.categoriaModerationTicket) {
            if (serverstats.tickets.find((x) => x.type == 'Moderation' && x.owner == interaction.user.id)) {
                return replyMessage(client, interaction, "Warning", "Ticket già aperto", "Puoi aprire un solo ticket alla volta")
            }

            let userstats = getUser(interaction.user.id)
            if (!userstats) userstats = addUser(interaction.member)[0]

            if (userstats.moderation.ticketOpened) {
                return replyMessage(client, interaction, "Warning", "Ticket già precedentemente aperto", "Puoi aprire un solo ticket di segnalazione")
            }
            else {
                if (userstats.moderation.type != "") {
                    userstats.moderation.ticketOpened = true
                    updateUser(userstats)
                }
            }

            let server = client.guilds.cache.get(settings.idServer);
            server.channels.create(`📩│${interaction.user.username}`, {
                type: "GUILD_TEXT",
                permissionOverwrites: [
                    {
                        id: server.id,
                        deny: ['VIEW_CHANNEL']
                    },
                    {
                        id: interaction.user.id,
                        allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS']
                    },
                    {
                        id: settings.ruoliStaff.moderatore,
                        allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS']
                    }
                ],
                parent: client.channels.cache.get(interaction.channelId).parentId
            })
                .then((canale) => {
                    interaction.deferUpdate()
                        .catch(() => { })

                    let embed = new Discord.MessageEmbed()
                        .setTitle(':scales: Segnalazione APERTA :scales:')
                        .setColor(colors.purple)
                        .setDescription('Segnala o richiedi supporto allo staff per il tuo stato di moderazione');

                    if (userstats.moderation.type) {
                        embed
                            .setDescription('Segnala o richiedi supporto allo staff per il tuo stato di moderazione' + (userstats.moderation.type == "Muted" ? ":mute: User **muted**" : userstats.moderation.type == "Tempmuted" ? ":mute: User **tempmuted**" : userstats.moderation.type == "Banned" ? ":no_entry: User **banned**" : userstats.moderation.type == "Tempbanned" ? ":no_entry: User **tempbanned**" : userstats.moderation.type == "Forcebanned" ? ":name_badge: User **Forcebanned**" : ""))
                            .addField(":page_facing_up: Reason", userstats.moderation.reason, true)
                            .addField(":shield: Moderator", userstats.moderation.moderator ? client.users.cache.get(userstats.moderation.moderator).toString() : client.user.toString(), true)
                            .addField(":alarm_clock: Since", `${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})`)

                        if (userstats.moderation.until)
                            embed
                                .addField(":hourglass: Until", `${moment(userstats.moderation.until).format("ddd DD MMM, HH:mm")} (in ${moment(userstats.moderation.until).toNow(true)})`)
                    }

                    let interaction1 = new Discord.MessageButton()
                        .setLabel('Chiudi ticket')
                        .setStyle('DANGER')
                        .setCustomId('chiudiTicket')

                    let row = new Discord.MessageActionRow()
                        .addComponents(interaction1)

                    canale.send({ embeds: [embed], components: [row] })
                        .then((msg) => {
                            serverstats.tickets.push({
                                type: `Moderation - ${interaction.channelId == settings.idCanaliServer.mutedTicket ? "Mute" : interaction.channelId == settings.idCanaliServer.tempmutedTicket ? "Tempmute" : interaction.channelId == settings.idCanaliServer.bannedTicket ? "Ban" : interaction.channelId == settings.idCanaliServer.tempbannedTicket ? "Tempban" : ""}`,
                                channel: canale.id,
                                owner: interaction.user.id,
                                message: msg.id,
                                daEliminare: false,
                            })

                            updateServer(serverstats)
                        });

                    canale.send(`<@${interaction.user.id}> ecco il tuo ticket`)
                        .then((msg) => {
                            msg.delete().catch(() => { });
                        })

                    let embed2 = new Discord.MessageEmbed()
                        .setTitle(":envelope_with_arrow: Ticket opened :envelope_with_arrow:")
                        .setColor(colors.green)
                        .addField(":alarm_clock: Time", `${moment(interaction.channel.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}`)
                        .addField(":bust_in_silhouette: Owner", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
                        .addField(":placard: Type", `Moderation - ${interaction.channelId == settings.idCanaliServer.mutedTicket ? "Mute" : interaction.channelId == settings.idCanaliServer.tempmutedTicket ? "Tempmute" : interaction.channelId == settings.idCanaliServer.bannedTicket ? "Ban" : interaction.channelId == settings.idCanaliServer.tempbannedTicket ? "Tempban" : ""}`)

                    if (!isMaintenance())
                        client.channels.cache.get(log.community.ticket).send({ embeds: [embed2] })
                });
        }
    },
};