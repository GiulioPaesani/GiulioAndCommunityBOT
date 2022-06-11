const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../config/general/colors.json")
const log = require("../../config/general/log.json")
const settings = require("../../config/general/settings.json")
const illustrations = require("../../config/general/illustrations.json")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { getUser } = require("../database/getUser")

const checkUnverifedUser = (client) => {
    let server = client.guilds.cache.get(settings.idServer)

    server.members.cache.filter(x => x.roles.cache.has(settings.idRuoloNonVerificato)).forEach(async user => {
        if (!getUser(user.id)) {
            if (new Date().getTime() - user.joinedTimestamp > 172800000) { //Utente ancora non verificato da 2 giorni
                let embed = new Discord.MessageEmbed()
                    .setTitle(":skull: User not verified :skull:")
                    .setColor(colors.gray)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                    .addField(":bust_in_silhouette: Member", `${user.user.toString()} - ${user.user.tag}\nID: ${user.id}`)
                    .addField(":red_car: Joined server", `${moment(user.joinedTimestamp).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(user.joinedTimestamp).fromNow()})`)

                if (!isMaintenance())
                    client.channels.cache.get(log.server.unverifiedUser).send({ embeds: [embed] })

                embed = new Discord.MessageEmbed()
                    .setTitle(":ping_pong: Kick :ping_pong:")
                    .setColor(colors.purple)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                    .addField(":brain: Executor", `${client.user.toString()} - ${client.user.tag}\nID: ${client.user.id}`)
                    .addField(":bust_in_silhouette: Member", `${user.user.toString()} - ${user.user.tag}\nID: ${user.id}`)
                    .addField(":page_facing_up: Reason", "Tempo di verifica scaduto")

                if (!isMaintenance())
                    client.channels.cache.get(log.moderation.kick).send({ embeds: [embed] })

                embed = new Discord.MessageEmbed()
                    .setTitle("Non ti sei VERIFICATO")
                    .setColor(colors.gray)
                    .setImage(illustrations.banner)
                    .setDescription("Sono passati più di **2 giorni** da quanto hai provato ad entrare nel server, ma non ti sei verificato e sei stato **espulso**.\n[Rientra nel server](https://discord.gg/ypTCaveew2) per poter **accedere** di nuovo e iniziare a parlare con tutti gli utenti")

                await user.send({ embeds: [embed] })
                    .catch(() => { })

                user.kick("Tempo di verifica scaduto")
                    .catch(() => { })
            }

            if ((new Date().getTime() - user.joinedTimestamp) == 3600000) { //Utente ancora non verificato da un ora
                let embed = new Discord.MessageEmbed()
                    .setTitle("Non ti sei ancora VERIFICATO")
                    .setColor(colors.gray)
                    .setImage(illustrations.banner)
                    .setDescription(`È passata più di **un ora** da quanto hai provato ad entrare nel server, ma non ti sei ancora **verificato**\nVai nel canale <#${settings.idCanaliServer.joinTheServer}>, leggi le regole e clicca sul bottone **"Entra nel server"**`)

                user.send({ embeds: [embed] })
                    .catch(() => { })
            }
        }
    })
}

module.exports = { checkUnverifedUser }