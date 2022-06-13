const Discord = require("discord.js")
const Parser = require('expr-eval').Parser;
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const log = require("../../config/general/log.json")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { getUser } = require("../../functions/database/getUser")
const { getServer } = require("../../functions/database/getServer")
const { updateUser } = require("../../functions/database/updateUser");
const { updateServer } = require("../../functions/database/updateServer");

module.exports = {
    name: "messageUpdate",
    client: "fun",
    async execute(client, oldMessage, newMessage) {
        if (!oldMessage) return
        if (!oldMessage.author) return

        if (isMaintenance(oldMessage.author.id)) return

        if (oldMessage.channel.id != settings.idCanaliServer.counting) return

        let numero, numero2
        try {
            numero = Parser.evaluate(oldMessage.content);
        }
        catch { return }

        try {
            numero2 = Parser.evaluate(newMessage.content);
            if (numero == numero2) return
        }
        catch { }

        let serverstats = getServer()

        if (serverstats.counting.lastMessage != newMessage.id) return

        newMessage.reactions.removeAll()

        let titleRandom = ["PENSAVI DI FREGARMI EH!", "CREDI DI FREGARMI?", "TE LO MODIFICHI E IO LO RISCRIVO...", "PENSI DI ESSERE FURBO? BHE LO SEI", "TI SENTI SIMPATICO?"]
        let embed = new Discord.MessageEmbed()
            .setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
            .setDescription(oldMessage.author.toString() + " ha modificato il numero `" + numero + "`")
            .setColor(colors.blue)

        oldMessage.channel.send({ embeds: [embed] })
            .then(msg => {
                embed = new Discord.MessageEmbed()
                    .setTitle(":pencil: Number edited :pencil:")
                    .setColor(colors.purple)
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                    .addField(":bust_in_silhouette: Member", `${newMessage.author.toString()} - ID: ${newMessage.author.id}`)
                    .addField(":envelope: Message", `
Old: ${oldMessage.content}
New: ${newMessage.content}`)

                // if (!isMaintenance())
                //     client.channels.cache.get(log.counting.editDeleteNumbers).send({ embeds: [embed] })
            })

        oldMessage.channel.send(numero.toString())
            .then(msg => {
                msg.react("🟢");
            })

        let userstats = getUser(newMessage.author.id)
        userstats.counting.updated++
        updateUser(userstats)

        serverstats.counting.updated++
        updateServer(serverstats)
    },
};