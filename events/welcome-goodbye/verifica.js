const Discord = require("discord.js")
const moment = require("moment")
const log = require("../../config/general/log.json")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const illustrations = require("../../config/general/illustrations.json")
const { getUser } = require("../../functions/database/getUser");
const { addUser } = require("../../functions/database/addUser")
const { isMaintenance } = require("../../functions/general/isMaintenance");
const { updateUser } = require("../../functions/database/updateUser");
const { invites } = require("../../functions/general/invites")
const { getAllUsers } = require("../../functions/database/getAllUsers")
const { checkUserLevelRole } = require("../../functions/leveling/checkLevelRoles")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (interaction.customId != "verifica") return

        await interaction.deferUpdate().catch(() => { })

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return


        let userstats = await getUser(interaction.user.id)

        if (!userstats || !userstats.joinedAt) {
            interaction.member.roles.add(settings.ruoliLeveling["0"])

            addUser(interaction.member)

            const botCount = interaction.guild.members.cache.filter(member => member.user.bot).size;
            const unverifiedCount = interaction.guild.members.cache.filter(member => member.roles.cache.size === 1).size;

            const utentiCount = interaction.guild.memberCount - botCount - unverifiedCount;

            let embed = new Discord.MessageEmbed()
                .setTitle(`:wave: Benvenuto ${interaction.user.username}`)
                .setColor(colors.blue)
                .setImage(illustrations.banner)
                .setDescription(`Ciao, benvenuto all'interno del server **GiulioAndCommunity**, sei il **${utentiCount}° membro**! In questo server potrai **parlare** e** divertirti** con tantissimi utenti tutti i giorni
Prima di partecipare al server leggi tutte le <#${settings.idCanaliServer.rules}> da rispettare e tutte le <#${settings.idCanaliServer.info}> sui tantissimi **comandi**, **funzioni** e canali nel server

:bust_in_silhouette: Prosegui per **configurare** il tuo profilo nel server con il bottone **"Configura profilo"** e impostare cose molto interessanti...
`)

            let button1 = new Discord.MessageButton()
                .setLabel("Configura profilo")
                .setStyle("PRIMARY")
                .setCustomId("setupAvanti,1")

            let row = new Discord.MessageActionRow()
                .addComponents(button1)

            interaction.user.send({ embeds: [embed], components: [row] })
                .catch(() => { })

            interaction.message.guild.invites.fetch().then(async guildInvites => {
                const ei = invites.get(interaction.message.guild.id);
                const invite = guildInvites.find(i => Object.fromEntries(ei)[i.code] < i.uses);

                let embed = new Discord.MessageEmbed()
                    .setTitle(":inbox_tray: Welcome :inbox_tray:")
                    .setColor(colors.green)
                    .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                    .addField(":bust_in_silhouette: Member", `${interaction.member.toString()} - ${interaction.user.tag}\nID: ${interaction.member.id}`)
                    .addField(":pencil: Account created", `${moment(interaction.user.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(interaction.user.createdAt).fromNow()})`)
                    .addField(":love_letter: Invite", invite ? `${invite.code} - Created by: ${client.users.cache.get(invite.inviter.id).toString()} (${invite.uses} uses)` : "User joined by Server Discovery")

                const maintenanceStatus = await isMaintenance()
                if (!maintenanceStatus)
                    client.channels.cache.get(log.server.welcomeGoodbye).send({ embeds: [embed] })
            })
        }
        else {
            let roles = ""
            let rolesUser = ""
            userstats.roles.forEach(role => {
                if (interaction.member.guild.roles.cache.get(role)) {
                    roles += `@${interaction.member.guild.roles.cache.get(role).name} - ID: ${role}\n`
                    rolesUser += `@${interaction.member.guild.roles.cache.get(role).name}\n`
                }
            })

            interaction.member.guild.invites.fetch().then(async guildInvites => {
                const ei = invites.get(interaction.member.guild.id);
                const invite = guildInvites.find(i => Object.fromEntries(ei)[i.code] < i.uses);

                let embed = new Discord.MessageEmbed()
                    .setTitle(":inbox_tray: Welcome back :inbox_tray:")
                    .setColor(colors.green)
                    .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                    .addField(":bust_in_silhouette: Member", `${interaction.member.toString()} - ${interaction.member.user.tag}\nID: ${interaction.member.id}`)
                    .addField(":pencil: Account created", `${moment(interaction.member.user.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(interaction.member.user.createdAt).fromNow()})`)
                    .addField(":red_car: Leaved server", `${moment(userstats.leavedAt).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(userstats.leavedAt).fromNow()})`)
                    .addField(":love_letter: Invite", invite ? `${invite.code} - Created by: ${client.users.cache.get(invite.inviter.id).toString()} (${invite.uses} uses)` : "User joined by Server Discovery")
                    .addField(":shirt: Roles", roles || "_No roles_")

                const maintenanceStatus = await isMaintenance()
                if (!maintenanceStatus)
                    client.channels.cache.get(log.server.welcomeGoodbye).send({ embeds: [embed] })

                userstats.leavedAt = null

                if (userstats.roles.length != 0) {
                    userstats.roles.forEach(role => {
                        interaction.member.roles.add(role)
                            .catch(() => { })
                    })

                    userstats.roles = [];
                }
                updateUser(userstats)

                const botCount = interaction.member.guild.members.cache.filter(x => x.user.bot).size;
                const unverifiedCount = interaction.member.guild.members.cache.filter(x => x.roles.cache.size === 1).size;

                const utentiCount = interaction.member.guild.memberCount - botCount - unverifiedCount;

                embed = new Discord.MessageEmbed()
                    .setTitle(`:wave: Bentornato ${interaction.member.user.username}`)
                    .setColor(colors.blue)
                    .setImage(illustrations.banner)
                    .setDescription(`Ciao, bentornato all'interno del server **GiulioAndCommunity**, sei il **${utentiCount}° membro**! In questo server potrai **parlare** e** divertirti** con tantissimi utenti tutti i giorni
    Prima di partecipare al server leggi nuovamente tutte le <#${settings.idCanaliServer.rules}> da rispettare e tutte le <#${settings.idCanaliServer.info}> sui tantissimi **comandi**, **funzioni** e canali nel server`)

                if (rolesUser)
                    embed.addField(":shirt: I tuoi ruoli", `
    Prima di uscire dal server avevi dei ruoli, ecco che ti sono stati ridati:
    ${rolesUser}`)

                interaction.member.send({ embeds: [embed] })
                    .catch(() => { })
            })

        }


    },
};