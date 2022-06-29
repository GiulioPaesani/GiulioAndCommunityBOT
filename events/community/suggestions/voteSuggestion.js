const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json");
const { getEmoji } = require("../../../functions/general/getEmoji");
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: `messageReactionAdd`,
    async execute(client, messageReaction, user) {
        const maintenanceStates = await isMaintenance(user.id)
        if (maintenanceStates) return

        if (user.bot) return

        if (messageReaction.message.partial) await messageReaction.message.fetch();

        if (messageReaction.message.channel.id != settings.idCanaliServer.suggestions) return

        if (!["vote1", "vote2", "vote3", "vote4", "vote5"].includes(messageReaction._emoji.name)) return messageReaction.users.remove(user)

        let reactionVotes = []
        let reactions = ["vote1", "vote2", "vote3", "vote4", "vote5"]
        for (let index in reactions) {
            let fetchReaction = await messageReaction.message.reactions.cache.find(x => x._emoji.name == reactions[index])?.users.fetch()
            reactionVotes.push(fetchReaction?.map(user => user.id).filter(x => x != client.user.id) || [])
        }

        if (reactionVotes.filter(x => x != reactionVotes[reactions.findIndex(y => y == messageReaction._emoji.name)]).find(x => x.includes(user.id))) {
            messageReaction.users.remove(user)
            return
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

        messageReaction.message.embeds[0].fields[0].value = `
Voto medio: **${media.toFixed(2)}**
${voteProgress}
        `

        if (!media) messageReaction.message.embeds[0].color = colors.red
        else if (media < 2) messageReaction.message.embeds[0].color = colors.red
        else if (media < 3) messageReaction.message.embeds[0].color = colors.yellow
        else if (media < 4) messageReaction.message.embeds[0].color = colors.green
        else if (media < 5) messageReaction.message.embeds[0].color = colors.blue
        else messageReaction.message.embeds[0].color = colors.purple

        messageReaction.message.edit({ embeds: [messageReaction.message.embeds[0]] })
    },
};