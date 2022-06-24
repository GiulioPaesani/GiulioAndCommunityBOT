const Discord = require("discord.js")
const Parser = require('expr-eval').Parser;
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { getUser } = require("../../functions/database/getUser")
const { getServer } = require("../../functions/database/getServer")
const { updateUser } = require("../../functions/database/updateUser");
const { updateServer } = require("../../functions/database/updateServer");

module.exports = {
    name: "messageUpdate",
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

        let serverstats = await getServer()

        if (serverstats.counting.lastMessage != newMessage.id) return

        newMessage.reactions.removeAll()

        let titleRandom = ["PENSAVI DI FREGARMI EH!", "CREDI DI FREGARMI?", "TE LO MODIFICHI E IO LO RISCRIVO...", "PENSI DI ESSERE FURBO? BHE LO SEI", "TI SENTI SIMPATICO?"]
        let embed = new Discord.MessageEmbed()
            .setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
            .setDescription(oldMessage.author.toString() + " ha modificato il numero `" + numero + "`")
            .setColor(colors.blue)

        oldMessage.channel.send({ embeds: [embed] })

        oldMessage.channel.send(numero.toString())
            .then(msg => {
                msg.react("🟢");
            })

        let userstats = await getUser(newMessage.author.id)
        userstats.counting.updated++
        updateUser(userstats)

        serverstats.counting.updated++
        updateServer(serverstats)
    },
};