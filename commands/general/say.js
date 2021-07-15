const Discord = require("discord.js");

module.exports = {
    name: "say",
    aliases: [],
    onlyStaff: false,
    channelsGranted: ["801019779480944660"],
    execute(message, args, client) {
        database.collection("userstats").find().toArray(function (err, result) {
            if (err) return codeError(err);
            var userstatsList = result;

            let testo = args.join(" ");
            if (!testo) {
                error(message, "Inserire un testo", "`!say [text]`")
                return
            }

            if (message.content.includes(`@everyone`) || message.content.includes(`@here`) || message.mentions.roles.first()) {
                warming(message, "Non pingare i ruoli", "Scrivi un messaggio senza taggare nessun ruolo del server")
                return
            }

            var userstats = userstatsList.find(x => x.id == message.author.id);
            if (!userstats) return

            if (!utenteMod(message.member) && userstats.level < 15 && !message.member.roles.cache.has(config.idRuoloServerBooster)) {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il livello")
                    .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                    .setColor("#ff653f")
                    .setDescription("Puoi utilizzare il comando `!say` solo dal **livello 15** o **boostando il server**")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            message.delete()
            message.channel.send(testo)
        })
    },
};