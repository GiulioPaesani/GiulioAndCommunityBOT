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