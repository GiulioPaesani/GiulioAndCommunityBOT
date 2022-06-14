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