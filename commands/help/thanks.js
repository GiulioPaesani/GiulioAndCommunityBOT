const Discord = require("discord.js")
const settings = require("../../config/general/settings.json");
const colors = require("../../config/general/colors.json")
const { getAllUsers } = require("../../functions/database/getAllUsers");
const { getEmoji } = require("../../functions/general/getEmoji");

module.exports = {
    name: "thanks",
    description: "Visualizzare statistiche ringrazimenti del server",
    permissionLevel: 0,
    cooldown: 5,
    requiredLevel: 0,
    syntax: "/thanks",
    category: "help",
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.help],
    async execute(client, interaction, comando) {
        let userstatsList = await getAllUsers(client);

        let leaderboardListThanks = userstatsList.filter(x => x.thanks).sort((a, b) => (a.thanks < b.thanks) ? 1 : ((b.thanks < a.thanks) ? -1 : 0));
        let leaderboardThanks = ""


        let totPage = Math.ceil(leaderboardListThanks.length / 10)
        let page = 1;

        for (let i = 10 * (page - 1); i < 10 * page; i++) {
            if (leaderboardListThanks[i]) {
                switch (i) {
                    case 0:
                        leaderboardThanks += ":first_place: ";
                        break
                    case 1:
                        leaderboardThanks += ":second_place: "
                        break
                    case 2:
                        leaderboardThanks += ":third_place: "
                        break
                    default:
                        leaderboardThanks += `**#${i + 1}** `
                }

                let utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == leaderboardListThanks[i].id);
                leaderboardThanks += `${utente.toString()} - **${leaderboardListThanks[i].thanks}**\n`
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(":heartpulse: Thanks :heartpulse:")
            .setColor(colors.purple)
            .setDescription("Classifica di ringraziamenti nel server")
            .addFields([
                {
                    name: ":gift_heart: Premi",
                    value: `Ogni **Domenica** alle **18:00** i primi **3 utenti** della **classifica settimanale** vinceranno dei **premi** come XP e Coins
_Vengono contati i ringrazimenti della settimana precedente e non quelli totali_`
                },
                {
                    name: ":diamond_shape_with_a_dot_inside: Classifica settimanale",
                    value: leaderboardThanks ? `Il tuo rank: ${leaderboardListThanks.findIndex(x => x.id == interaction.user.id) < 0 ? "###" : `**#${leaderboardListThanks.findIndex(x => x.id == interaction.user.id) + 1}** ${interaction.user.toString()} - **${leaderboardListThanks.find(x => x.id == interaction.user.id).thanks}**`}\n\n${leaderboardThanks}` : "_Nessun ringraziamento_"
                }
            ])

        if (totPage > 0)
            embed.setFooter({ text: `Page ${page}/${totPage}` })

        const button1 = new Discord.MessageButton()
            .setCustomId(`thanksLb,${interaction.user.id},settimanale,1,1`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous2"))

        const button2 = new Discord.MessageButton()
            .setCustomId(`thanksLb,${interaction.user.id},settimanale,${page - 1},2`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous"))

        if (page == 1) {
            button1.setDisabled()
            button2.setDisabled()
        }

        let button3 = new Discord.MessageButton()
            .setCustomId(`thanksLb,${interaction.user.id},settimanale,${page + 1},3`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next"))

        let button4 = new Discord.MessageButton()
            .setCustomId(`thanksLb,${interaction.user.id},settimanale,${totPage},4`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next2"))

        if (page == totPage || totPage == 0) {
            button3.setDisabled()
            button4.setDisabled()
        }

        const button5 = new Discord.MessageButton()
            .setLabel("Classifica settimanale")
            .setStyle("SUCCESS")
            .setCustomId(`thanks,${interaction.user.id},settimanale`)

        const button6 = new Discord.MessageButton()
            .setLabel("Classifica generale")
            .setStyle("PRIMARY")
            .setCustomId(`thanks,${interaction.user.id},generale`)

        const button7 = new Discord.MessageButton()
            .setLabel("Come ricevere Ringraziamenti")
            .setStyle("SECONDARY")
            .setCustomId(`thanks,${interaction.user.id},tutorial`)

        const row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)

        const row2 = new Discord.MessageActionRow()
            .addComponents(button5)
            .addComponents(button6)
            .addComponents(button7)

        interaction.reply({ embeds: [embed], components: [row, row2] })
    },
};