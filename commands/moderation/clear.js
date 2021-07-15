const Discord = require("discord.js");
const ms = require("ms")

module.exports = {
    name: "clear",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    async execute(message, args, client) {
        try {
            count = parseInt(message.content.split(/\s+/)[1]) + 1;
        } catch {
            error(message, "Valore non valido", "`!clear [count]`")
            return
        }

        if (!count || count < 1) {
            error(message, "Valore non valido", "`!clear [count]`")
            return
        }

        if (count < 100) {
            await message.channel.bulkDelete(count, true)
        }
        else {
            await message.channel.bulkDelete(100, true)
            count = 100
        }

        var embed = new Discord.MessageEmbed()
            .setTitle("Messaggi eliminati")
            .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
            .setColor("#16A0F4")
            .setDescription("Sono stati eliminati " + (count - 1) + " messaggi")

        message.channel.send(embed)
            .then(msg => {
                msg.delete({ timeout: 15000 })
            })
    },
};