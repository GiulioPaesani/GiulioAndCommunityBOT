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
    name: "messageDelete",
    async execute(client, message) {
        if (!message.author) return

        if (isMaintenance(message.author.id)) return

        if (message.channel.id != settings.idCanaliServer.counting) return

        let numero
        try {
            numero = Parser.evaluate(message.content);
        }
        catch { return }

        let serverstats = await getServer()

        if (serverstats.counting.lastMessage != message.id) return

        let titleRandom = ["PENSAVI DI FREGARMI EH!", "PENSI DI ESSERE FURBO? BHE LO SEI", "TI SENTI SIMPATICO?"]
        let embed = new Discord.MessageEmbed()
            .setTitle(titleRandom[Math.floor(Math.random() * titleRandom.length)])
            .setDescription(message.author.toString() + " ha eliminato il numero `" + numero + "`")
            .setColor(colors.blue)

        message.channel.send({ embeds: [embed] })

        message.channel.send(numero.toString())
            .then(msg => {
                msg.react("🟢");
            })

        let userstats = await getUser(message.author.id)
        userstats.counting.deleted++
        updateUser(userstats)

        serverstats.counting.deleted++
        updateServer(serverstats)
    },
};
