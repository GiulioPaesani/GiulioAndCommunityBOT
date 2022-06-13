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

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (interaction.customId != "verifica") return

        interaction.deferUpdate().catch(() => { })

        if (isMaintenance(interaction.user.id)) return

        if (getUser(interaction.user.id) && getUser(interaction.user.id).joinedAt) return

        interaction.member.roles.remove(settings.idRuoloNonVerificato)

        if (!getUser(interaction.user.id)) {
            addUser(interaction.member)
        }
        else {
            let userstats = getUser(interaction.user.id)
            userstats.joinedAt = interaction.member.joinedAt.getTime()
            updateUser(userstats)

            userstats.roles.forEach(role => {
                member.roles.add(role)
                    .catch(() => { })
            })
        }

        const botCount = interaction.guild.members.cache.filter(member => member.user.bot).size;
        const unverifiedCount = interaction.guild.members.cache.filter(member => member.roles.cache.has(settings.idRuoloNonVerificato)).size;

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

        interaction.message.guild.invites.fetch().then(guildInvites => {
            const ei = invites.get(interaction.message.guild.id);
            const invite = guildInvites.find(i => Object.fromEntries(ei)[i.code] < i.uses);

            let embed = new Discord.MessageEmbed()
                .setTitle(":inbox_tray: Welcome :inbox_tray:")
                .setColor(colors.green)
                .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":bust_in_silhouette: Member", `${interaction.member.toString()} - ${interaction.user.tag}\nID: ${interaction.member.id}`)
                .addField(":pencil: Account created", `${moment(interaction.user.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(interaction.user.createdAt).fromNow()})`)
                .addField(":love_letter: Invite", invite ? `${invite.code} - Created from: ${client.users.cache.get(invite.inviter.id).toString()} (${invite.uses} uses)` : "User joined by Server Discovery")

            // if (!isMaintenance())
            //     client.channels.cache.get(log.server.welcomeGoodbye).send({ embeds: [embed] })

            let userstats = getUser(interaction.user.id)
            if (!userstats) userstats = addUser(interaction.member)[0]

            if (invite) {
                let userstatsInviter = getUser(invite.inviter.id)
                if (!userstatsInviter) userstatsInviter = addUser(client.users.cache.get(invite.inviter.id))[0]

                userstatsInviter.invites[interaction.user.id] = "inServer"
                updateUser(userstatsInviter)
            }

            let userstatsList = getAllUsers(client)
            userstatsList.filter(x => x.invites[interaction.user.id]).forEach(userstats2 => {
                if (invite && invite.inviter.id == userstats2.id) {

                }
                else {
                    userstats2.invites[interaction.user.id] = "inServerOtherInvite"
                    updateUser(userstats2)
                }
            })
        })
    },
};