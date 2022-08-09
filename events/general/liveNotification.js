const { isMaintenance } = require("../../functions/general/isMaintenance");

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        const maintenanceStates = await isMaintenance(message.author.id)
        if (maintenanceStates) return

        if (message.guild?.id != "823195402463215666") return
        if (message.author?.id != "375805687529209857") return

        if (!message.content.endsWith("has finished streaming.")) {
            await client.channels.cache.get("1004644492776845392").send(`
-------------🟣 **𝐍𝐄𝐖 𝐋𝐈𝐕𝐄** 🟣-------------
Ehy ragazzi, è appena iniziata una live sul Twitch di **GiulioAndCode**
Venite subito a divertirvi in \"**${message.content}**\"

<https://www.twitch.tv/giulioandcode>`)
                .then(async msg => {
                    msg.crosspost()
                })
        }
        else {
            client.channels.cache.get("1004644492776845392").messages.fetch({ limit: 10 })
                .then(messages => {
                    for (let msg of Array.from(messages.values())) {
                        if (msg.content.includes("🟣 **𝐍𝐄𝐖 𝐋𝐈𝐕𝐄** 🟣")) {
                            msg.edit(`${msg.content.replace("🟣 **𝐍𝐄𝐖 𝐋𝐈𝐕𝐄** 🟣", "📺 **𝐍𝐄𝐖 𝐋𝐈𝐕𝐄** 📺")}\n_La stream è terminata_`)
                            return
                        }
                    }
                })
        }
    },
};
