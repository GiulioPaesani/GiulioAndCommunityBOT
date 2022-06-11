const settings = require("../../config/general/settings.json")
const { isMaintenance } = require("../../functions/general/isMaintenance");
const { checkBadwords } = require("../../functions/moderaction/checkBadwords")
const { getEmoji } = require("../../functions/general/getEmoji");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");

const { musicBots, clientFun, clientModeration, clientRanking } = require("../../index.js");

module.exports = {
    name: "messageCreate",
    client: "general",
    async execute(client, message) {
        if (isMaintenance(message.author.id)) return
        if (message.guild?.id != settings.idServer) return

        if (message.channel.id == settings.idCanaliServer.onewordstory) return

        let [trovata, nonCensurato, censurato] = checkBadwords(message.content);
        if (trovata && !getUserPermissionLevel(client, message.author.id) && !message.member.roles.cache.has(settings.idRuoloFeatureActivator)) return

        if (message.mentions.users.size == 0) return

        let reply = {}
        reply[client.user.id] = {
            client: client,
            reply: ["Come osi taggarmi?", `Come ti permetti di taggare ${client.user.username}? ${getEmoji(client, "GiulioAngry")}`, `Ehy ciao, io sono Giulio! No... in realtà sono ${client.user.username}`, "Ciao! :wave:", "Ehy come va?", "Aiuto, qua mi sfruttano, aiutatemi!", `Ehy ${message.author.toString()}, come butta la vita?`, "Ma ogni tanto scrivi anche messaggi sensati o tagghi sempre gente a caso?", "Ehy! Mi hai distratto! Stavo facendo lezioni di acquagym", "La smetti di taggarmi? Bastaaaa", "Io non ne posso più di stare in questo server...", "Io sono stanco di eseguire sempre i vostri comandi, quando vado in pensione? Ho una certa età ormai :older_man:"]
        }
        reply[clientFun.user.id] = {
            client: clientFun,
            reply: ["Come osi taggarmi?", `Come ti permetti di taggare ${client.user.username}? ${getEmoji(client, "GiulioAngry")}`, `Ehy ciao, io sono Giulio! No... in realtà sono ${client.user.username}`, "Ciao! :wave:", "Ehy come va?", "Vuoi divertirti? Bhe io sono qua apposta", "Ti va di divertirti un po'? Giuro non ho della droga ||forse...||", `Ehy ${message.author.toString()}, come butta la vita?`, "Ma ogni tanto scrivi anche messaggi sensati o tagghi sempre gente a caso?", ""]
        }
        reply[clientModeration.user.id] = {
            client: clientModeration,
            reply: ["Come osi taggarmi?", `Come ti permetti di taggare ${client.user.username}? ${getEmoji(client, "GiulioAngry")}`, `Ehy ciao, io sono Giulio! No... in realtà sono ${client.user.username}`, "Ciao! :wave:", "Ehy come va?", "Io sono qua a controllarvi, mi raccomando non dite parolacce", `Fate i bravi mi raccomando, altrimenti BAN!! ${getEmoji(client, "GiulioBan")}`, `Ehy ${message.author.toString()}, come butta la vita?`, "Ma ogni tanto scrivi anche messaggi sensati o tagghi sempre gente a caso?"]
        }
        reply[clientRanking.user.id] = {
            client: clientRanking,
            reply: ["Come osi taggarmi?", `Come ti permetti di taggare ${client.user.username}? ${getEmoji(client, "GiulioAngry")}`, `Ehy ciao, io sono Giulio! No... in realtà sono ${client.user.username}`, "Ciao! :wave:", "Ehy come va?", "Vuoi qualche livello in più eh? Bhe io non te lo do :smiling_face_with_tear:", "Ti piacerebbe essere al livello 10.000? Bhe sappi che non ci arriverai mai", `Ehy ${message.author.toString()}, come butta la vita?`, "Basta scrivere solo per guadagnare xp e salire di livello!", "Ma ogni tanto scrivi anche messaggi sensati o tagghi sempre gente a caso?"]
        }
        musicBots.forEach(bot => {
            reply[bot.client.user.id] = {
                client: bot.client,
                reply: ["Come osi taggarmi?", `Come ti permetti di taggare ${bot.client.user.username}? ${getEmoji(client, "GiulioAngry")}`, `Ehy ciao, io sono Giulio! No... in realtà sono ${bot.client.user.username}`, "Ciao! :wave:", "Ehy come va?", "Se ti va di ascoltare un po' di musica, io sono qua?", `Ehy ${message.author.toString()}, come butta la vita?`, "Basta scrivere! Vieni ad ascoltare un po' di musica con me", "Smettila di scrivere in questa brutta chat, vieni ad ascoltare un po' musica con me", `Io non ne posso più di riprodurre musica, quando iniziano le ferie?`, `${message.author.toString()} devo dire che ascolti proprio musica bruttissima eh`, "Ma ogni tanto scrivi anche messaggi sensati o tagghi sempre gente a caso?"]
            }
        });

        for (let bot in reply) {
            if (message.mentions.users.get(bot)) {
                reply[bot].client.channels.cache.get(message.channel.id).messages.fetch(message.id).then(msg => {
                    msg.reply(reply[bot].reply[Math.floor(Math.random() * reply[bot].reply.length)])
                })
            }
        }
    },
};
