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
            .setColor("#16A0F4")
            .setDescription("Sono stati eliminati " + (count - 1) + " messaggi")

        var data = new Date()
        if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
            embed.setThumbnail("https://i.postimg.cc/NFXTGVdf/Correct-Halloween.png")
        }
        else {
            embed.setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
        }

        message.channel.send(embed)
            .then(msg => {
                msg.delete({ timeout: 10000 })
                    .catch(() => { })
            })
    },
};