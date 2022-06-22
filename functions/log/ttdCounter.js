const log = require("../../config/general/log.json");
const { fetchAllMessages } = require("../general/fetchAllMessages")

const ttdCounter = async (client) => {
    let counter = {
        "💡 Idea": 0,
        "⚪ Uncompleted": 0,
        "🔴 Urgent": 0,
        "🟢 Completed": 0,
        "🔵 Tested": 0,
        "⚫ Finished": 0,
    }

    let channel = client.channels.cache.get(log.general.thingsToDo)
    await fetchAllMessages(channel)
        .then(async messages => {
            for (let msg of messages) {
                for (let index in counter) {
                    if (msg.embeds[0]?.fields[0].name == index || msg.embeds[0]?.fields[0].value == index) {
                        counter[index]++
                    }
                }
            }
        })

    let text = ""
    for (let index in counter) {
        if (counter[index] != 0)
            text += `${index.split(" ")[0]} - ${counter[index]}\n`
    }

    if (channel.topic != `${text}\n${channel.topic.split("\n\n").slice(1).join("\n\n")}`)
        channel.setTopic(`${text}\n${channel.topic.split("\n\n").slice(1).join("\n\n")}`)
}

module.exports = { ttdCounter }