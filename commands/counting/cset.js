module.exports = {
    name: "cset",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    async execute(message, args, client) {
        if (!args[0]) {
            error(message, "Inserire un valore", "`!cset [count]`")
            return
        }

        var count = parseInt(args[0])
        if (!count) {
            error(message, "Inserire un valore valido", "`!cset [count]`")
            return
        }

        if (count > serverstats.bestScore) {
            warning(message, "Inserire un valore valido", "Non puoi inserire un numero maggiore del record del server")
            return
        }

        serverstats.numero = count;
        serverstats.ultimoUtente = "NessunUtente"

        correct(message, "Ultimo numero cambiato", "L'ultimo numero è stato cambiato in " + count + ", ora potete continuare a contare")
        message.channel.send(count)
            .then(msg => {
                msg.react("🟢")
            })
    },
};