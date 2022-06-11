const fetch = require("node-fetch");
const settings = require("../../../config/general/settings.json");
const colors = require("../../../config/general/colors.json");
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: `messageReactionRemoveAll`,
    client: "general",
    async execute(client, message, reactions) {
        if (message.partial) await message.fetch();

        if (message.channel.id != settings.idCanaliServer.polls && message.channel.id != settings.idCanaliServer.staffPolls) return

        let discordEmoji = await fetch("https://gist.githubusercontent.com/rigwild/1b509bf69e2a2391f44aa5de3f05b006/raw/e4b5bfa81ea3e7e51af1f5585964666115934631/discord_emojis.json")
        discordEmoji = await discordEmoji.json();

        let emoji = message.embeds[0].fields[0].value.split("\n").map(x => x.split(" ")[0]).map(x => discordEmoji[x] ? discordEmoji[x] : x)

        emoji.forEach(x => message.react(x))

        let reactionVotes = []
        for (let index in emoji) {
            let fetchReaction = await message.reactions.cache.find(x => x._emoji.name == reactions[index] || `<${x._emoji.animated ? "a" : ""}:${x._emoji.name}:${x._emoji.id}>` == reactions[index])?.users.fetch()
            reactionVotes.push(fetchReaction?.map(user => user.id).filter(x => x != client.user.id) || [])
        }

        let pollText = ""
        let i = 0
        message.embeds[0].fields[0].value.split("\n").forEach(x => {
            let perc = 100 * reactionVotes[i].length / reactionVotes.reduce((acc, y) => acc + y.length, 0)
            if (!perc) perc = 0

            pollText += `${x.split(" ").slice(0, -3).join(" ")} **${reactionVotes[i].length}** - ${perc % 1 == 0 ? perc : perc.toFixed(2)}%\n`
            i++
        })

        if (message.embeds[0].fields[0].value != pollText) {
            message.embeds[0].fields[0].value = pollText

            message.edit({ embeds: [message.embeds[0]] })
        }
    },
};