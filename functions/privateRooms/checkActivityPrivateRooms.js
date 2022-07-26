const Discord = require('discord.js')
const colors = require("../../config/general/colors.json")
const settings = require("../../config/general/settings.json")
const { getServer } = require('./../../functions/database/getServer')
const { updateServer } = require('./../../functions/database/updateServer')

const checkActivityPrivateRooms = async (client) => {
    let serverstats = await getServer()

    serverstats.privateRooms.forEach(async room => {
        if (room.lastActivity && room.lastActivityCount == 0 && new Date().getTime() - room.lastActivity >= 345600000) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Stanza un po' inattiva")
                .setColor(colors.yellow)
                .setDescription(`${room.type == "text" ? `Questa stanza` : `La tua stanza <#${room.channel}>`} è inutilizzata da più di **4 giorni**\nTra **tre giorni** verrà eliminata se risulterà ancora inattiva\n\nSe non utilizzi più questa stanza eliminala subito con \`/pdelete\` altrimenti premi sul pulsante **"Annulla eliminazione"** per poter continuare ad usarla`)

            let button1 = new Discord.MessageButton()
                .setLabel("Annulla eliminazione")
                .setStyle("DANGER")
                .setCustomId(`annullaEliminazione,${room.channel}`)

            let row = new Discord.MessageActionRow()
                .addComponents(button1)

            if (room.type == "text") {
                client.channels.cache.get(room.channel)?.send(room.owners.map(x => `<@${x}>`).join(" "))
                    .then(msg => msg.delete().catch(() => { }))

                client.channels.cache.get(room.channel)?.send({ embeds: [embed], components: [row] })
                    .catch(() => { })
            }
            else {
                room.owners.forEach(owner => {
                    client.users.cache.get(owner)?.send({ embeds: [embed], components: [row] })
                        .catch(() => { })
                })
            }

            serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.channel == room.channel)].lastActivityCount = 1
            updateServer(serverstats)
        }
        if (room.lastActivity && room.lastActivityCount == 1 && new Date().getTime() - room.lastActivity >= 604800000) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Stanza troppo inattiva")
                .setColor(colors.yellow)
                .setDescription(`${room.type == "text" ? `Questa stanza` : `La tua stanza <#${room.channel}>`} è inutilizzata da più di **7 giorni**\nTra **un'ora** verrà eliminata se risulterà ancora inattiva\n\nSe non utilizzi più questa stanza eliminala subito con \`/pdelete\` altrimenti premi sul pulsante **"Annulla eliminazione"** per poter continuare ad usarla`)

            let button1 = new Discord.MessageButton()
                .setLabel("Annulla eliminazione")
                .setStyle("DANGER")
                .setCustomId(`annullaEliminazione,${room.channel}`)

            let row = new Discord.MessageActionRow()
                .addComponents(button1)

            if (room.type == "text") {
                client.channels.cache.get(room.channel)?.send(room.owners.map(x => `<@${x}>`).join(" "))
                    .then(msg => msg.delete().catch(() => { }))

                client.channels.cache.get(room.channel)?.send({ embeds: [embed], components: [row] })
                    .catch(() => { })
            }
            else {
                room.owners.forEach(owner => {
                    client.users.cache.get(owner)?.send({ embeds: [embed], components: [row] })
                        .catch(() => { })
                })
            }

            serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.channel == room.channel)].lastActivityCount = 2
            updateServer(serverstats)
        }
        if (room.lastActivity && room.lastActivityCount == 2 && new Date().getTime() - room.lastActivity >= 608400000) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Stanza inattiva eliminato")
                .setColor(colors.yellow)
                .setDescription(`La tua stanza <#${room.channel}> è stato inutilizzata per più di **7 giorni** ed è stata eliminata per inattività\nSe ti va puoi riaprire un'altra stanza nel canale <#${settings.idCanaliServer.privateRooms}>`)

            room.owners.forEach(async owner => {
                await client.users.cache.get(owner)?.send({ embeds: [embed] })
                    .catch(() => { })
            })

            serverstats.privateRooms = serverstats.privateRooms.filter(x => x.channel != room.channel)

            updateServer(serverstats)

            await client.channels.cache.get(room.channel)?.delete()
        }
    })
}

module.exports = { checkActivityPrivateRooms }