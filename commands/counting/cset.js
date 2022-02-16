module.exports = {
    name: "cset",
    aliases: [],
    onlyStaff: true,
    availableOnDM: false,
    description: "Settare il numero di counting corrente",
    syntax: "!cset [number]",
    category: "fun",
    channelsGranted: [],
    async execute(message, args, client, property) {
        if (!args[0]) {
            return botCommandMessage(message, "Error", "Inserire un valore", "Scrivi il numero da ripristinare", property)
        }

        var count = parseInt(args[0])
        if (!count) {
            return botCommandMessage(message, "Error", "Inserire un valore valido", "Scrivi un numero valido", property)
        }

        if (count > serverstats.bestScore) {
            return botCommandMessage(message, "Error", "Numero troppo alto", "Non puoi ripristinare un numero maggiore del record del server", property)
        }

        var oldNumber = serverstats.numero
        serverstats.numero = count;
        serverstats.ultimoUtente = "NessunUtente"

        botCommandMessage(message, "Correct", "Numero corrente cambiato", `Numero corrente cambiato in **${count}**, ora potete continuare a contare`)
        message.channel.send(count.toString())
            .then(msg => {
                msg.react("🟢")

                var embed = new Discord.MessageEmbed()
                    .setTitle(":beginner: Number setted :beginner:")
                    .setColor("#8227cc")
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":brain: Executor", `${message.author.toString()} - ID: ${message.author.id}`, false)
                    .addField("Number", `
Old: ${oldNumber}
New: ${serverstats.numero}`, false)

                if (!isMaintenance())
                    client.channels.cache.get(log.counting.setNumber).send({ embeds: [embed] })
            })
    },
};