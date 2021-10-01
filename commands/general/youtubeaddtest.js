const Discord = require("discord.js");

module.exports = {
    name: "add",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    async execute(message, args, client) {
        console.log(args)
        let ChannelLink = args[0];
        let DiscordChannel =
            message.mentions.channels
                .filter((c) => c.guild.id == message.guild.id)
                .first() || message.guild.channels.cache.get(args[1]);
        let DiscordUser =
            message.mentions.members
                .filter((m) => m.guild.id == message.guild.id)
                .first()?.user || message.guild.members.cache.get(args[2])?.user;
        let Notification =
            args.slice(3).join(" ") || client.YTP.options.defaults.Notification;
        let preventDuplicates = true;
        if (!ChannelLink || !DiscordChannel || !DiscordUser)
            return message.channel.send({
                embed: new Discord.MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                        `:x: Usage: \`${prefix}set <LINK> <CHANNEL> <USER> [TEXT...]\`\n\n**Replacements:**\n` +
                        toreplace_format
                    ),
            });
        //set a Channel
        client.YTP.setChannel(
            ChannelLink,
            DiscordChannel,
            DiscordUser,
            Notification,
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