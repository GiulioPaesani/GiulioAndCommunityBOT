const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const illustrations = require("../../config/general/illustrations.json")
const log = require("../../config/general/log.json")
const { invites } = require("../../functions/general/invites")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { getUser } = require("../../functions/database/getUser")
const { updateUser } = require("../../functions/database/updateUser")
const { getAllUsers } = require("../../functions/database/getAllUsers")
const { addUser } = require("../../functions/database/addUser")

module.exports = {
    name: "guildMemberAdd",
    async execute(client, member) {
        if (isMaintenance(member.user.id)) return

        if (member.user.bot) return
        if (member.guild.id != settings.idServer) return

        member.guild.invites.fetch()
            .then(guildInvites => {
                invites[member.guild.id] = guildInvites;
            })

        let userstats = await getUser(member.user.id)
        if (!userstats || !userstats.joinedAt) {
            member.roles.add(settings.idRuoloNonVerificato)
            client.channels.cache.get(settings.idCanaliServer.joinTheServer).send(member.toString())
                .then(msg => msg.delete().catch(() => { }))
            return
        }

        let roles = ""
        let rolesUser = ""
        userstats.roles.forEach(role => {
            if (member.guild.roles.cache.get(role)) {
                roles += `@${member.guild.roles.cache.get(role).name} - ID: ${role}\n`
                rolesUser += `@${member.guild.roles.cache.get(role).name}\n`
            }
        })

        member.guild.invites.fetch().then(guildInvites => {
            const ei = invites.get(member.guild.id);
            const invite = guildInvites.find(i => Object.fromEntries(ei)[i.code] < i.uses);

            let embed = new Discord.MessageEmbed()
                .setTitle(":inbox_tray: Welcome back :inbox_tray:")
                .setColor(colors.green)
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":bust_in_silhouette: Member", `${member.toString()} - ${member.user.tag}\nID: ${member.id}`)
                .addField(":pencil: Account created", `${moment(member.user.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(member.user.createdAt).fromNow()})`)
                .addField(":red_car: Leaved server", `${moment(userstats.leavedAt).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(userstats.leavedAt).fromNow()})`)
                .addField(":love_letter: Invite", invite ? `${invite.code} - Created from: ${client.users.cache.get(invite.inviter.id).toString()} (${invite.uses} uses)` : "User joined by Server Discovery")
                .addField(":shirt: Roles", roles || "_No roles_")

            if (!isMaintenance())
                client.channels.cache.get(log.server.welcomeGoodbye).send({ embeds: [embed] })

            if (invite) {
                let userstatsInviter = await getUser(invite.inviter.id)
                if (!userstatsInviter) userstatsInviter = await addUser(client.users.cache.get(invite.inviter.id))

                userstatsInviter.invites[member.user.id] = "inServer"
                updateUser(userstatsInviter)
            }

            let userstatsList = await getAllUsers(client)
            userstatsList.filter(x => x.invites[member.user.id]).forEach(userstats2 => {
                if (invite && invite.inviter.id == userstats2.id) {

                }
                else {
                    userstats2.invites[member.user.id] = "inServerOtherInvite"
                    updateUser(userstats2)
                }
            })

            userstats.leavedAt = null

            if (userstats.roles.length != 0) {
                userstats.roles.forEach(role => {
                    member.roles.add(role)
                        .catch(() => { })
                })

                userstats.roles = [];
            }
            updateUser(userstats)

            const botCount = member.guild.members.cache.filter(x => x.user.bot).size;
            const unverifiedCount = member.guild.members.cache.filter(x => x.roles.cache.has(settings.idRuoloNonVerificato)).size;

            const utentiCount = member.guild.memberCount - botCount - unverifiedCount;

            embed = new Discord.MessageEmbed()
                .setTitle(`:wave: Bentornato ${member.user.username}`)
                .setColor(colors.blue)
                .setImage(illustrations.banner)
                .setDescription(`Ciao, bentornato all'interno del server **GiulioAndCommunity**, sei il **${utentiCount}° membro**! In questo server potrai **parlare** e** divertirti** con tantissimi utenti tutti i giorni
Prima di partecipare al server leggi nuovamente tutte le <#${settings.idCanaliServer.rules}> da rispettare e tutte le <#${settings.idCanaliServer.info}> sui tantissimi **comandi**, **funzioni** e canali nel server`)

            if (rolesUser)
                embed.addField(":shirt: I tuoi ruoli", `
Prima di uscire dal server avevi dei ruoli, ecco che ti sono stati ridati:
${rolesUser}`)

            member.send({ embeds: [embed] })
                .catch(() => { })
        })
    }
}