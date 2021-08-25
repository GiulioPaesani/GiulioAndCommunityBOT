module.exports = {
    name: "setlevel",
    aliases: ["setrank"],
    onlyStaff: true,
    channelsGranted: [],
    async execute(message, args, client) {
        database = await getDatabase()
        await database.collection("userstats").find().toArray(async function (err, result) {
            if (err) return codeError(err);
            var userstatsList = result;

            var utente = message.mentions.members.first()
            if (!utente) {
                var utente = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args.slice(0, -1).join(" ")) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args.slice(0, -1).join(" ")) || message.guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == args.slice(0, -1).join(" "))
            }

            if (!utente) {
                error(message, "Utente non trovato", "`!setlevel [user] [level]`")
                return
            }

            var userstats = userstatsList.find(x => x.id == utente.id);
            if (!userstats) return

            if (!args[args.length - 1]) {
                error(message, "Inserire un livello", "`!setlevel [user] [level]`")
                return
            }

            var setLevel = await parseInt(args[args.length - 1]);
            if (!setLevel && setLevel != 0) {
                error(message, "Livello non valido", "`!setlevel [user] [level]`")
                return
            }

            if (setLevel < 0) {
                error(message, "Livello non valido", "`!setlevel [user] [level]`")
                return
            }

            await database.collection("userstats").updateOne({ id: utente.id }, { $set: { level: setLevel, xp: calcoloXpNecessario(setLevel) } });

            await setLevelRole(utente, setLevel)

            await correct(message, "Livello impostato", "Livello " + setLevel + " impostato a " + utente.toString())
        })
        await database.close()
    },
};