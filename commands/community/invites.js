const Discord = require("discord.js")
const settings = require("../../config/general/settings.json");
const { addUser } = require("../../functions/database/addUser");
const { getUser } = require("../../functions/database/getUser");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");
const { replyMessage } = require("../../functions/general/replyMessage");

module.exports = {
    name: "invites",
    description: "Visualizzare quanti utenti ha invitato un utente nel server",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 5,
    syntax: "/invites (user)",
    category: "community",
    data: {
        options: [
            {
                name: "user",
                description: "Utente di cui vedere gli inviti",
                type: "STRING",
                required: false
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user")) || interaction.user

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non un bot", "Non puoi vedere gli inviti di un bot", comando)
        }

        let userstats = await getUser(utente.id)
        if (!userstats) userstats = await addUser(interaction.guild.members.cache.get(utente.id) || utente)

        if (!userstats.invites) userstats.invites = {}

        let embed = new Discord.MessageEmbed()
            .setTitle(`Invites - ${interaction.guild.members.cache.get(utente.id)?.nickname ? interaction.guild.members.cache.get(utente.id).nickname : utente.username}`)
            .setDescription("Membri che ha invitato questo utente nel server")
            .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
            .addField(":love_letter: Members", `
Total members invited: ${Object.keys(userstats.invites).length}
Members in the guild: ${Object.keys(userstats.invites).filter(x => userstats.invites[x] == "inServer").length}
Members in the guild with other inviter: ${Object.keys(userstats.invites).filter(x => userstats.invites[x] == "inServerOtherInvite").length}
Members left: ${Object.keys(userstats.invites).filter(x => userstats.invites[x] == "leaved").length}
`)

        interaction.reply({ embeds: [embed] })
    },
};