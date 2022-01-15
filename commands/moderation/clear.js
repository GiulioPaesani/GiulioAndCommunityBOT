module.exports = {
    name: "clear",
    aliases: [],
    onlyStaff: true,
    availableOnDM: false,
    description: "Eliminare messaggi in massa",
    syntax: "!clear [count]",
    category: "moderation",
    channelsGranted: [],
    async execute(message, args, client, property) {
        try {
            count = parseInt(message.content.split(/\s+/)[1]) + 1;
        } catch {
            return botCommandMessage(message, "Error", "Valore non valido", "Hai inserito un numero non valido", property)
        }

        if (!count || count < 1) {
            return botCommandMessage(message, "Error", "Valore non valido", "Hai inserito un numero non valido", property)
        }

        if (count < 100) {
            await message.channel.bulkDelete(count, true)
        }
        else {
            await message.channel.bulkDelete(100, true)
            count = 100
        }
    },
};