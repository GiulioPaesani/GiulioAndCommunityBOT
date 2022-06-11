const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const items = require("../../../config/ranking/items.json")
const illustrations = require("../../../config/general/illustrations.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getEmoji } = require("../../../functions/general/getEmoji")

module.exports = {
    name: "test",
    description: "Test se il bot è online",
    permissionLevel: 1,
    requiredLevel: 0,
    syntax: "/test",
    category: "general",
    client: "general",
    otherGuild: true,
    channelsGranted: [],
    async execute(client, interaction, comando) {
        interaction.reply({ content: ":green_circle: Bot ONLINE" })
    },
};