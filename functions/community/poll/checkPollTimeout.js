const moment = require("moment")
const settings = require("../../../config/general/settings.json")
const colors = require("../../../config/general/colors.json")
const { fetchAllMessages } = require("../../general/fetchAllMessages")

const checkPollTimeout = async (client) => {
    let channel = client.channels.cache.get(.settings.idCanaliServerpolls)

    fetchAllMessages(channel)
        .then(async messages => {
            for (let msg of messages) {
                let pollDate = moment(msg.embeds[0]?.footer?.text.split(" ").slice(3).join(" "), "DD MMM HH:mm")
                if (pollDate.valueOf() - new Date().getTime() < 0) {
                    if (msg.embeds[0]?.footer?.text.startsWith("Poll close")) {
                        msg.embeds[0].footer.text = `Poll delete on ${moment().add(86400000, "ms").format("DD MMM HH:mm")}`
                        msg.reactions.removeAll()
                        msg.embeds[0].title = `[CLOSED] ${msg.embeds[0].title}`
                        msg.embeds[0].color = colors.red
                        msg.edit({ embeds: [msg.embeds[0]] })
                    }
                    else if (msg.embeds[0]?.footer?.text.startsWith("Poll delete")) {
                        msg.delete()
                    }
                }
            }
        })
}

module.exports = { checkPollTimeout }