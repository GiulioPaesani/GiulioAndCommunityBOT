const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json");
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");



module.exports = {
    name: "eval",
    description: "Eseguire una stringa di codice",
    permissionLevel: 3,
    requiredLevel: 0,
    syntax: "/eval [text]",
    category: "general",
    data: {
        options: [
            {
                name: "text",
                description: "Stringa da eseguire",
                type: "STRING",
                required: true,
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        async function calcMsg() {
            const msg = await interaction.channel.send('Conteggio in corso degli messaggi negli ultimi 28 giorni...');

            const allMessages = [];
            const fetchMsgs = async (channel, lastMessage) => {
                const options = { limit: 100 };
                if (lastMessage) options.before = lastMessage;

                if (!channel.messages) return;

                const msgs = await channel.messages.fetch(options);

                allMessages.push(
                    ...msgs
                        .filter(
                            (x) =>
                                !x.author.bot &&
                                getUserPermissionLevel(client, x.author.id) === 0 &&
                                x.createdTimestamp >=
                                new Date().getTime() - (1000 * 60 * 60 * 24 * 28)
                        )
                        .values()
                );

                lastMessage = msgs.last()?.id;

                if (
                    msgs.size === 100 &&
                    msgs.last().createdTimestamp >= new Date().getTime() - (1000 * 60 * 60 * 24 * 28)
                ) {
                    console.log('calcolo...');
                    await fetchMsgs(channel, msgs.last().id);
                }
            };

            for (const channel of interaction.guild.channels.cache) {
                if (channel[1].id == '869975192645034085') {
                    console.log(`inizio ${channel[1].name}`);
                    await fetchMsgs(channel[1]);
                    console.log(`fine ${channel[1].name}`);
                }
            }

            const usersMessages = []
            allMessages.forEach(msg => {
                if (!usersMessages.find(x => x.userId === msg.author.id))
                    usersMessages.push({
                        userId: msg.author.id,
                        count: 1
                    });
                else {
                    usersMessages[usersMessages.findIndex(x => x.userId === msg.author.id)].count++;
                }
            })

            const sorted = usersMessages.sort(
                (x, y) =>
                    (x.count < y.count) ? 1 : (x.count > y.count) ? -1 : 0);

            let leaderboard = '';
            for (let i = 0; i < 10; i++) {
                if (sorted[i]) {
                    leaderboard += `${client.users.cache.get(sorted[i].userId)} (ID: ${sorted[i].userId}) - ${sorted[i].count} msgs\n`;
                }
            }

            msg.edit(`Utenti più attivi:\n${leaderboard}\n\n_Non vengono considerati utenti bot e staff_`);
        }

        let text = interaction.options.getString("text")

        text = text.replace(eval(`/${client.token}/g`), `#######TOKEN#######`)

        try {
            let evaled = await eval(text)

            if (evaled) {
                evaled = evaled.toString()
                evaled = evaled.replace(eval(`/${client.token}/g`), `#######TOKEN#######`)
            }

            let embed = new Discord.MessageEmbed()
                .setColor(colors.purple)
                .setTitle("Eval")
                .addField(":inbox_tray: Input", text.slice(0, 1024))
                .addField(":outbox_tray: Output", !evaled ? "Null" : evaled.slice(0, 1024))

            interaction.reply({ embeds: [embed] })
        }
        catch (error) {
            error = error.stack || error
            error = error.replace(eval(`/${client.token}/g`), `#######TOKEN#######`)

            let embed = new Discord.MessageEmbed()
                .setColor(colors.red)
                .setTitle("Error with Eval")
                .addField(":inbox_tray: Input", text.slice(0, 1024))
                .addField(":name_badge: Error", error.slice(0, 1024))

            interaction.reply({ embeds: [embed] })
        }
    },
};
