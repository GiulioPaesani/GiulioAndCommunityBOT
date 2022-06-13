const Discord = require('discord.js');
const moment = require("moment");
const settings = require("../../../config/general/settings.json");
const colors = require("../../../config/general/colors.json");
const log = require("../../../config/general/log.json");
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { counterChannels } = require("../../../functions/server/counterChannels")
const { youtubeNotifications } = require("../../../functions/server/youtubeNotifications")
const { subtractCooldown } = require("../../../functions/leveling/cooldownXp");
const { autoBackup } = require("../../../functions/general/autoBackup");
const { checkBirthday } = require("../../../functions/community/birthday/checkBirthday");
const { checkModeraction } = require("../../../functions/moderaction/checkModeration");
const { invites } = require("../../../functions/general/invites");
const { checkModRoles } = require("../../../functions/moderaction/checkModRoles");
const { ttsInactivity } = require("../../../functions/music/tts/ttsQueue");
const { checkActivityPrivateRooms } = require("../../../functions/privateRooms/checkActivityPrivateRooms");
const { checkPollTimeout } = require("../../../functions/community/poll/checkPollTimeout");
const { newStory } = require("../../../functions/onewordstory/newStory");
const { clientFun, clientModeration, clientRanking } = require("../../../index");
const { checkUnverifedUser } = require("../../../functions/general/checkUnverifedUser");
const { checkRoomInDB } = require("../../../functions/privateRooms/checkRoomInDB");
const { checkTicketInDB } = require("../../../functions/ticket/checkTicketInDB");
const { checkLevelRoles } = require("../../../functions/leveling/checkLevelRoles");
const { getServer } = require('../../../functions/database/getServer');
const { ttdCounter } = require("../../../functions/log/ttdCounter");

module.exports = {
    name: "ready",
    client: "general",
    async execute(client) {
        console.log(`-- ${client.user.username} è ONLINE! --`);

        client.user.setActivity('/help', { type: 'WATCHING' });

        let serverstats = getServer()
        const maintenanceStates = process.env.isHost == "false" ? serverstats.maintenance.local : serverstats.maintenance.host

        let embed = new Discord.MessageEmbed()
            .setTitle(`Tutti i BOT sono ONLINE! - ${process.env.isHost == "false" ? "Local" : "Host"}`)
            .setColor(colors.green)
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":construction: Maintenance", maintenanceStates == 0 ? `Off - Everyone can use bot` : maintenanceStates == 1 ? `Mode 1 - Only tester can use bot` : maintenanceStates == 2 ? `Mode 2 - Nobody can use bot` : maintenanceStates == 3 ? `Mode 3 - Everyone, except testers, can use bot` : "", true)

        // client.channels.cache.get(log.general.ready).send({ embeds: [embed] })

        if (!isMaintenance()) {
            setInterval(counterChannels, 1000 * 60 * 5, client)
            setInterval(youtubeNotifications, 1000 * 60 * 2, client)
            setInterval(subtractCooldown, 1000 * 5)
            setInterval(autoBackup, 1000, client)
            setInterval(checkBirthday, 1000, client)
            setInterval(checkModRoles, 1000 * 10, clientModeration)
            //  !!!! setInterval(checkLevelRoles, 1000 * 10, clientRanking)
            setInterval(ttsInactivity, 1000, client)
            setInterval(checkActivityPrivateRooms, 1000 * 10, client)
            setInterval(checkPollTimeout, 1000 * 10, client)
            setInterval(checkModeraction, 1000 * 60, clientModeration)
            setInterval(checkUnverifedUser, 1000 * 60, client)
            setInterval(checkRoomInDB, 1000 * 10, client)
            setInterval(checkTicketInDB, 1000 * 10, client)
            setInterval(ttdCounter, 1000 * 60 * 5, client)
            //  !!!! setInterval(newStory, 1000, clientFun)
        }

        let utente = client.guilds.cache.get(settings.idServer).members.cache.get(client.user.id)
        utente?.voice?.disconnect()

        const firstInvites = await client.guilds.cache.get(settings.idServer).invites.fetch()
        invites.set(settings.idServer, new Map(firstInvites.map((invite) => [invite.code, invite.uses])));

        let server = client.guilds.cache.get(settings.idServer)
        let serverLog = client.guilds.cache.get(log.idServer)
        let guildCommands = []
        let guildLogCommands = []
        await server.commands.fetch()
            .then(commands => {
                commands.forEach(command => {
                    guildCommands.push(command)
                    if (!client.commands.get(command.name)) {
                        command.delete()
                    }
                })
            })
        await serverLog.commands.fetch()
            .then(commands => {
                commands.forEach(command => {
                    guildLogCommands.push(command)
                    if (!client.commands.get(command.name)) {
                        command.delete()
                    }
                })
            })

        await client.commands
            .forEach(async command => {
                let data = command.data || {}
                data.name = command.name
                data.description = command.description

                if (!guildCommands.find(x => x.name == command.name))
                    await server.commands.create(data)
                if (!guildLogCommands.find(x => x.name == command.name) && command.otherGuild)
                    await serverLog.commands.create(data)
            })
    }
}