const Discord = require("discord.js");

module.exports = {
    name: "add",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    async execute(message, args, client) {

        await client.YTP.deleteChannel(message.guild.id, "https://www.youtube.com/channel/UCK6QwAdGWOWN9AT1_UQFGtA")

        var canale = await client.channels.cache.get("869975176895418438")

        await client.YTP.setChannel(
            "https://www.youtube.com/channel/UCK6QwAdGWOWN9AT1_UQFGtA",
            canale,
            message.member,
            `-------------:computer: **𝐍𝐄𝐖 𝐕𝐈𝐃𝐄𝐎** :computer:-------------
Ehy ragazzi, è appena uscito un nuovo video su **GiulioAndCode**
Andate subito a vedere "**{videotitle}**"

{videourl}
<@&857544584691318814>`,
            (preventDuplicates = true)
        )
            .then((ch) => {
                console.log(ch)//See the Responses: https://github.com/tovade/discord-youtube/wiki/Responses
                //send the information
                message.channel
                    .send({
                        embed: new Discord.MessageEmbed()
                            .setColor("GREEN")
                            .setDescription(
                                `I will now post Notifications for ${ch.YTchannel} (<@${ch.DiscordUser}>) in <#${ch.DiscordChannel}>\n\nThe Message:\n${ch.message}`
                            ),
                    })
                    .then((msg) => msg.react("👍"));
            })
            .catch((e) => {
                console.log(e);
                message.channel.send(`${e.message ? e.message : e}`, {
                    code: "js",
                });
            });

        await client.YTP.setChannel(
            "https://www.youtube.com/channel/UCvIafNR8ZvZyE5jVGVqgVfA",
            canale,
            message.member,
            `-------------:v: **𝐍𝐄𝐖 𝐕𝐈𝐃𝐄𝐎** :v:-------------
Ehy ragazzi, è appena uscito un nuovo video su **Giulio**
Andate subito a vedere "**{videotitle}**"

{videourl}
<@&883062518774370345>`,
            (preventDuplicates = true)
        )
            .then((ch) => {
                console.log(ch)//See the Responses: https://github.com/tovade/discord-youtube/wiki/Responses
                //send the information
                message.channel
                    .send({
                        embed: new Discord.MessageEmbed()
                            .setColor("GREEN")
                            .setDescription(
                                `I will now post Notifications for ${ch.YTchannel} (<@${ch.DiscordUser}>) in <#${ch.DiscordChannel}>\n\nThe Message:\n${ch.message}`
                            ),
                    })
                    .then((msg) => msg.react("👍"));
            })
            .catch((e) => {
                console.log(e);
                message.channel.send(`${e.message ? e.message : e}`, {
                    code: "js",
                });
            });



    },
};