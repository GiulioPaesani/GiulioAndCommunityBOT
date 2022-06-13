const fetch = require("node-fetch");
const settings = require("../../../config/general/settings.json");
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: `messageReactionRemove`,
    client: "general",
    async execute(client, messageReaction, user) {
        if (isMaintenance(user.id) && user.id != client.user.id) return

        if (messageReaction.message.partial) await messageReaction.message.fetch();

        if (messageReaction.message.channel.id != settings.idCanaliServer.polls && messageReaction.message.channel.id != settings.idCanaliServer.staffPolls) return

        if (messageReaction.message.embeds[0].footer.text.startsWith("Poll delete")) return

        let discordEmoji = await fetch("https://gist.githubusercontent.com/rigwild/1b509bf69e2a2391f44aa5de3f05b006/raw/e4b5bfa81ea3e7e51af1f5585964666115934631/discord_emojis.json")
        discordEmoji = await discordEmoji.json();

        let emoji = messageReaction.message.embeds[0].fields[0].value.split("\n").map(x => x.split(" ")[0]).map(x => discordEmoji[x] ? discordEmoji[x] : x)

        if (!emoji.includes(messageReaction._emoji.name) && !emoji.includes(`<${messageReaction._emoji.animated ? "a" : ""}:${messageReaction._emoji.name}:${messageReaction._emoji.id}>`)) return

        if (user.id == client.user.id) messageReaction.message.react(messageReaction._emoji.name).catch(() => messageReaction.message.react(`<${messageReaction._emoji.animated ? "a" : ""}:${messageReaction._emoji.name}:${messageReaction._emoji.id}>`).catch(() => { }))

        let reactionVotes = []
        let reactions = emoji
        for (let index in reactions) {
            let fetchReaction = await messageReaction.message.reactions.cache.find(x => x._emoji.name == reactions[index] || `<${x._emoji.animated ? "a" : ""}:${x._emoji.name}:${x._emoji.id}>` == reactions[index])?.users.fetch()
            reactionVotes.push(fetchReaction?.map(x => x.id).filter(x => x != client.user.id) || [])
        }

        let pollText = ""
        let i = 0
        messageReaction.message.embeds[0].fields[0].value.split("\n").forEach(x => {
            if (reactionVotes[i]) {
                let perc = 100 * reactionVotes[i].length / reactionVotes.reduce((acc, y) => acc + y.length, 0)
                if (!perc) perc = 0

                pollText += `${x.split(" ").slice(0, -3).join(" ")} **${reactionVotes[i].length}** - ${perc % 1 == 0 ? perc : perc.toFixed(2)}%\n`
                i++
            }
        })

        messageReaction.message.embeds[0].fields[0].value = pollText

        messageReaction.message.edit({ embeds: [messageReaction.message.embeds[0]] })
    },
};