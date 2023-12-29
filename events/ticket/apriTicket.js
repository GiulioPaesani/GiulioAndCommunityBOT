const Discord = require("discord.js")
const moment = require("moment")
const log = require("../../config/general/log.json")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const { isMaintenance } = require("../../functions/general/isMaintenance");
const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { updateServer } = require("../../functions/database/updateServer");
const { getUser } = require("../../functions/database/getUser")
const { addUser } = require("../../functions/database/addUser")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (interaction.customId != "apriTicket") return

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        let serverstats = await getServer()

        if (serverstats.tickets.find((x) => x.type == 'Normal' && x.owner == interaction.user.id)) {
            return replyMessage(client, interaction, "Warning", "Ticket già aperto", "Puoi aprire un solo ticket alla volta")
        }

        let userstats = await getUser(interaction.user.id)
        if (!userstats) userstats = await addUser(interaction.member)

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
            .then(async canale => {
                await interaction.deferUpdate()
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

                const maintenanceStatus = await isMaintenance()
                if (!maintenanceStatus)
                    client.channels.cache.get(log.community.ticket).send({ embeds: [embed2] })
            })
    },
};