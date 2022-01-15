module.exports = {
    name: "slowmode",
    aliases: [],
    onlyStaff: true,
    availableOnDM: false,
    description: "Impostare il cooldown di scrittura di ogni utente",
    syntax: "!slowmode [time]",
    category: "moderation",
    channelsGranted: [],
    async execute(message, args, client, property) {
        var time = message.content.split(/\s+/)[1];
        if (!time) {
            return botCommandMessage(message, "Error", "Inserire un tempo", "Scrivi il tempo dello slowmode", property)
        }

        if (time != "off" && time != "no" && time != 0) {
            time = ms(time)

            if (!time) {
                return botCommandMessage(message, "Error", "Inserire un tempo", "Scrivi il tempo dello slowmode", property)
            }

            if (time > 21600000) {
                return botCommandMessage(message, "Error", "Troppa slowmode", "Inserisci un tempo non superiore a 6 ore", property)
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

        botCommandMessage(message, "Correct", "Slowmode impostata", time == 0 ? "Slowmode disattivata" : `Slowmode impostata a ${tempo}`)
    },
};