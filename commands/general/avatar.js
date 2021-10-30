module.exports = {
    name: "avatar",
    aliases: [],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands],
    async execute(message, args, client) {
        if (!args[0]) {
            var utente = message.member;
        }
        else {
            var utente = message.mentions.members.first()
            if (!utente) {
                var utente = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args[0]) || message.guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == args.join(" "))
            }
        }

        if (!utente) {
            error(message, "Utente non trovato", "`!avatar [user]`");
            return
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(utente.user.tag)
            .setDescription(`L'avatar di questo utente
Other formats: **[.gif](${utente.user.displayAvatarURL({ dynamic: true, size: 1024, format: `gif` })})** | **[.jpeg](${utente.user.displayAvatarURL({ dynamic: false, size: 1024, format: `jpeg` })})** | **[.webp](${utente.user.displayAvatarURL({ dynamic: false, size: 1024, format: `webp` })})** | **[.png](${utente.user.displayAvatarURL({ dynamic: false, size: 1024, format: `png` })})**`)

            .setImage(utente.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 1024
            }))

        message.channel.send(embed)
    },
};