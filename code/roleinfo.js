module.exports = {
    name: "roleinfo",
    aliases: ["rolestats"],
    description: "Ottenere le **statistiche** di un ruolo",
    info: "",
    video: "",
    code: `
const { Permissions } = require('discord.js');
client.on("message", message => {
    if (message.content.startsWith("!roleinfo")) {
        var ruolo = message.mentions.roles.first()
        if (!ruolo) {
            message.channel.send("Non ho trovato questo ruolo")
            return
        }
        var memberCount = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == ruolo)).size;
        var permessiRuolo = new Permissions(ruolo.permissions.bitfield);
        var elencoPermessi = "";
        if (permessiRuolo.has("ADMINISTRATOR")) {
            elencoPermessi = "👑ADMINISTRATOR";
        }
        else {
            var permissions = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"]
            for (var i = 0; i < permissions.length; i++) {
                if (permessiRuolo.has(permissions[i])) {
                    elencoPermessi += "- " + permissions[i] + "
";
                }
            }
        }
        var embed = new Discord.MessageEmbed()
            .setTitle(ruolo.name)
            .setDescription("Tutte le statistiche di questo ruolo")
            .addField("Role ID",ruolo.id, true)
            .addField("Members", memberCount, true)
            .addField("Color", ruolo.hexColor, true)
            .addField("Role created", ruolo.createdAt.toDateString(), true)
            .addField("Permissions", elencoPermessi, false)
        message.channel.send(embed)
    }
})`
};
