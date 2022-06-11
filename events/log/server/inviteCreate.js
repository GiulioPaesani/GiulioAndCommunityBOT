const Discord = require('discord.js');
const moment = require('moment');
const ms = require('ms');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { invites } = require("../../../functions/general/invites")

module.exports = {
    name: `inviteCreate`,
    client: "general",
    async execute(client, invite) {
        invites.get(invite.guild.id).set(invite.code, invite.uses);

        if (isMaintenance()) return

        if (invite.guild.id != settings.idServer) return

        let embed = new Discord.MessageEmbed()
            .setTitle(":mouse_three_button: Invite created :mouse_three_button:")
            .setColor(colors.green)
            .setThumbnail(invite.guild.members.cache.get(invite.inviter.id).displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":bust_in_silhouette: Inviter", `${invite.inviter.toString()} - ${invite.inviter.tag}\nID: ${invite.inviter.id}`, false)
            .addField(":link: Code", invite.code, false)
            .addField(":anchor: Channel", `${invite.channel.toString()} - #${invite.channel.name}\nID: ${invite.channel.id}`)

        client.channels.cache.get(log.server.invites).send({ embeds: [embed] })
    },
};