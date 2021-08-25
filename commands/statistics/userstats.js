const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
    name: "userstats",
    aliases: ["user", "userinfo"],
    onlyStaff: false,
    channelsGranted: ["869975190052929566"],
    async execute(message, args, client) {
        database.collection("userstats").find().toArray(async function (err, result) {
            if (err) return codeError(err);
            var userstatsList = result;

            if (!args[0]) {
                var utente = message.member;
            }
            else {
                var utente = message.mentions.members.first()
                if (!utente) {
                    var utente = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == args.join(" "))
                }
            }

            if (!utente) {
                error(message, "Utente non trovato", "`!userinfo [user]`");
                return
            }

            var userstats = userstatsList.find(x => x.id == utente.id);
            if (!userstats) return

            let elencoRuoli = "";
            utente._roles.forEach(idRuolo => elencoRuoli += `- ${message.guild.roles.cache.get(idRuolo).name}\r`);

            if (elencoRuoli == "")
                elencoRuoli = "Nessun ruolo";

            let status = utente.user.presence.status;
            switch (status) {
                case "online": status = "Online"; break;
                case "offline": status = "Offline"; break;
                case "dnd": status = "Do not disturb"; break;
                case "idle": status = "Idle"; break;
            }

            const badge = await utente.user.fetchFlags()
            const userFlags = badge.toArray()
            const elencoBadge = userFlags.length ? userFlags.map(flag => flag).join(" ") : 'Nessun badge'

            let embed = new Discord.MessageEmbed()
                .setTitle(utente.user.tag)
                .setDescription("Tutte le statistiche su questo utente")
                .setThumbnail(utente.user.avatarURL({ dynamic: true }))
                .addField(":receipt: User ID", "```" + utente.user.id + "```", true)
                .addField(":ok_hand: Status", "```" + status + "```", true)
                .addField(":robot: Is a bot", utente.user.bot ? "```Yes```" : "```No```", true)
                .addField(":pencil: Account created", "```" + moment(utente.user.createdAt).format("ddd DD MMM, HH:mm") + " (" + moment(utente.user.createdAt).fromNow() + ")```", false)
                .addField(":red_car: Joined this server", "```" + moment(utente.joinedTimestamp).format("ddd DD MMM, HH:mm") + " (" + moment(utente.joinedTimestamp).fromNow() + ")```", false)
                //                 .addField(":bar_chart: Statistics",`\`\`\`
                // Total message: ${userstats.statistics.totalMessage}
                // Commands executed: ${userstats.statistics.commands}
                // Edited message: ${userstats.statistics.editMessage}
                // Deleted message: ${userstats.statistics.deleteMessage}
                // Reactions added: ${userstats.statistics.addReaction}\`\`\``, false)
                .addField(":beginner: Badge", "```" + elencoBadge + "```", false)
                .addField(":shirt: Roles", "```" + elencoRuoli + "```", false)

            message.channel.send(embed)
        })
    },
};