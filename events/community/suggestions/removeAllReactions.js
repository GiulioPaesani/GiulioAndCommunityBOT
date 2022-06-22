const fetch = require("node-fetch");
const settings = require("../../../config/general/settings.json");
const colors = require("../../../config/general/colors.json");
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getEmoji } = require("../../../functions/general/getEmoji");

module.exports = {
    name: `messageReactionRemoveAll`,
    async execute(client, message, reactions) {
        if (message.partial) await message.fetch();

        if (message.channel.id != settings.idCanaliServer.suggestions) return

        let emoji = ["vote1", "vote2", "vote3", "vote4", "vote5"]
        emoji.forEach(x => message.react(getEmoji(client, x)))

        let reactionVotes = []
        for (let index in emoji) {
            let fetchReaction = await message.reactions.cache.find(x => x._emoji.name == emoji[index])?.users.fetch()
            reactionVotes.push(fetchReaction?.map(user => user.id).filter(x => x != client.user.id) || [])
        }

        let somma = 0
        let reactionNum = 0

        reactionVotes.forEach(reactions => {
            reactions.forEach(() => {
                reactionNum++
                somma += reactionVotes.findIndex(x => x == reactions) + 1
            })
        })

        let media = somma / reactionNum

        let voteProgress = ""

        if (media <= 1 + 1 / 6 * 1) voteProgress += getEmoji(client, "suggest12")
        else if (media <= 1 + 1 / 6 * 3) voteProgress += getEmoji(client, "suggest13")
        else if (media <= 1 + 1 / 6 * 5) voteProgress += getEmoji(client, "suggest14")
        else voteProgress += getEmoji(client, "suggest15")

        if (media <= 1 + 1 / 6 * 5) voteProgress += getEmoji(client, "suggest21")
        else if (media <= 1 + 1 / 6 * 7) voteProgress += getEmoji(client, "suggest22")
        else if (media <= 1 + 1 / 6 * 9) voteProgress += getEmoji(client, "suggest23")
        else if (media <= 1 + 1 / 6 * 11) voteProgress += getEmoji(client, "suggest24")
        else voteProgress += getEmoji(client, "suggest25")

        if (media <= 1 + 1 / 6 * 11) voteProgress += getEmoji(client, "suggest21")
        else if (media <= 1 + 1 / 6 * 13) voteProgress += getEmoji(client, "suggest32")
        else if (media <= 1 + 1 / 6 * 15) voteProgress += getEmoji(client, "suggest33")
        else if (media <= 1 + 1 / 6 * 17) voteProgress += getEmoji(client, "suggest34")
        else voteProgress += getEmoji(client, "suggest35")

        if (media <= 1 + 1 / 6 * 17) voteProgress += getEmoji(client, "suggest41")
        else if (media <= 1 + 1 / 6 * 19) voteProgress += getEmoji(client, "suggest42")
        else if (media <= 1 + 1 / 6 * 21) voteProgress += getEmoji(client, "suggest43")
        else if (media <= 1 + 1 / 6 * 23) voteProgress += getEmoji(client, "suggest44")
        else voteProgress += getEmoji(client, "suggest45")

        message.embeds[0].fields[0].value = `
Voto medio: **${media ? media.toFixed(2) : "##"}**
${media ? voteProgress : `${getEmoji(client, "suggest11")}${getEmoji(client, "suggest21")}${getEmoji(client, "suggest21")}${getEmoji(client, "suggest41")}`}
`

        if (!media) message.embeds[0].color = colors.red
        else if (media < 2) message.embeds[0].color = colors.red
        else if (media < 3) message.embeds[0].color = colors.yellow
        else if (media < 4) message.embeds[0].color = colors.green
        else if (media < 5) message.embeds[0].color = colors.blue
        else message.embeds[0].color = colors.purple

        message.edit({ embeds: [message.embeds[0]] })
    },
};