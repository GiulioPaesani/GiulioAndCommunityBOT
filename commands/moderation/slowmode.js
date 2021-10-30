module.exports = {
    name: "slowmode",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    async execute(message, args, client) {
        var time = message.content.split(/\s+/)[1];
        if (!time) {
            error(message, "Inserire un tempo", "`!slowmode [time]/off`")
            return
        }

        if (time != "off" && time != "no" && time != 0) {
            time = ms(time)

            if (!time) {
                error(message, "Tempo non valido", "`!slowmode [time]/off`")
                return
            }

            if (time > 21600000) {
                warning(message, "Troppa slowmode", "Non puoi impostare una slowmode superiore a 6 ore")
                return
            }

            var tempo = ms(time, { long: true });
            tempo = tempo + " "
            tempo = tempo.replace("second ", "secondo")
            tempo = tempo.replace("seconds", "secondi")
            tempo = tempo.replace("minute ", "minuto ")
            tempo = tempo.replace("minutes", "minuti")
            tempo = tempo.replace("hour ", "ora ")
            tempo = tempo.replace("hours", "ore")
        }

        if (time == "off" || time == "no" || time == 0)
            time = 0

        message.channel.setRateLimitPerUser(parseInt(time) / 1000)

        var embed = new Discord.MessageEmbed()
            .setTitle("Slowmode impostata")
            .setColor("#16A0F4")

        var data = new Date()
        if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
            embed.setThumbnail("https://i.postimg.cc/NFXTGVdf/Correct-Halloween.png")
        }
        else {
            embed.setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
        }

        if (time == 0) {
            embed.setDescription("Slowmode disattivata")
        }
        else {
            embed.setDescription("Slowmode impostata a " + tempo)
        }
        message.channel.send(embed)
    },
};