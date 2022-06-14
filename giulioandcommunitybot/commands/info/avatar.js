const Discord = require("discord.js")
const settings = require("../../config/general/settings.json");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");

module.exports = {
    name: "avatar",
    description: "Visuallizzare l'immagine profilo di un utente",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/avatar (user)",
    category: "info",
    client: "general",
    data: {
        options: [
            {
                name: "user",
                description: "Utente di cui vedere l'immagine",
                type: "STRING",
                required: false
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user")) || interaction.user

        if (interaction.guild.members.cache.get(utente.id) && interaction.guild.members.cache.get(utente.id).displayAvatarURL() != utente.displayAvatarURL()) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Avatar - " + (interaction.guild.members.cache.get(utente.id)?.nickname ? interaction.guild.members.cache.get(utente.id).nickname : utente.username))
                .setDescription(`L'avatar di questo utente
Altri formati: **[.gif](${utente.displayAvatarURL({ dynamic: true, size: 1024, format: `gif` })})** - **[.jpeg](${utente.displayAvatarURL({ dynamic: false, size: 1024, format: `jpeg` })})** - **[.png](${utente.displayAvatarURL({ dynamic: false, size: 1024, format: `png` })})**`)
                .setThumbnail(utente.displayAvatarURL({
                    dynamic: true,
                    format: "png",
                    size: 1024
                }))
                .setImage(interaction.guild.members.cache.get(utente.id).displayAvatarURL({
                    dynamic: true,
                    format: "png",
                    size: 1024
                }))

            interaction.reply({ embeds: [embed] })
        }
        else {
            let embed = new Discord.MessageEmbed()
                .setTitle("Avatar - " + (interaction.guild.members.cache.get(utente.id)?.nickname ? interaction.guild.members.cache.get(utente.id).nickname : utente.username))
                .setDescription(`L'avatar di questo utente
Altri formati: **[.gif](${utente.displayAvatarURL({ dynamic: true, size: 1024, format: `gif` })})** - **[.jpeg](${utente.displayAvatarURL({ dynamic: false, size: 1024, format: `jpeg` })})** - **[.png](${utente.displayAvatarURL({ dynamic: false, size: 1024, format: `png` })})**`)
                .setImage(utente.displayAvatarURL({
                    dynamic: true,
                    format: "png",
                    size: 1024
                }))

            interaction.reply({ embeds: [embed] })
        }
    },
};