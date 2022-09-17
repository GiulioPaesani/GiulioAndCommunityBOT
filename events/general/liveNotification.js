const { isMaintenance } = require("../../functions/general/isMaintenance");
const settings = require("../../config/general/settings.json")

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        const maintenanceStates = await isMaintenance(message.author.id)
        if (maintenanceStates) return

        if (message.guild?.id != "823195402463215666") return
        if (message.author?.id != "375805687529209857") return

        if (!message.content.endsWith("has finished streaming.")) {
            await client.channels.cache.get("1004644492776845392").send(`
----- 🟣 **NEW LIVE** 🟣 -----
Ehy ragazzi, è appena iniziata una live ${message.content.endsWith("GiulioAndCraft") ? "sulla :video_game: **GiulioAndCraft**" : message.content.endsWith("GiulioAndCoding") ? "su :keyboard: **GiulioAndCoding**" : message.content.endsWith("Community Event") ? "sui :trophy: **Community Event**" : "su Twitch"}
Venite subito a divertirvi in \"**${message.content}**\"

<https://www.twitch.tv/giulioandcode>
<@&${settings.ruoliNotification.live}>`)
                .then(async msg => {
                    msg.crosspost()
                })
        }
        else {
            client.channels.cache.get("1004644492776845392").messages.fetch({ limit: 10 })
                .then(messages => {
                    for (let msg of Array.from(messages.values())) {
                        if (msg.content.includes("🟣 **NEW LIVE** 🟣")) {
                            msg.edit(`${msg.content.replace("🟣 **NEW LIVE** 🟣", "📺 **NEW LIVE** 📺")}\n_La stream è terminata_`)
                        }
                    }
                })
        }
    },
};
