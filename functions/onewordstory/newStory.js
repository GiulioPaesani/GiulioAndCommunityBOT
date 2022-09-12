const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../config/general/colors.json")
const settings = require("../../config/general/settings.json")
const { getAllUsers } = require("../database/getAllUsers")
const { getServer } = require("../database/getServer")
const { updateServer } = require("../database/updateServer")
const { updateUser } = require("../database/updateUser")

const newStory = async (client) => {
    let date = new Date()
    if (date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
        client.channels.cache.get("1003566272803504138").send("1 - è ora!")

        let serverstats = await getServer()

        let embed = new Discord.MessageEmbed()
            .setTitle(":orange_book: Storia terminata")
            .setColor(colors.purple)
            .setDescription("Il tempo per la storia di oggi è **terminato**, ecco tutto quello che avete scritto")
            .addField(":bar_chart: Info", `
Parole scritte: ${serverstats.onewordstory.totWordsToday}
Utenti unici partecipanti: ${serverstats.onewordstory.words.filter((v, i, a) => a.findIndex(x => x.user == v.user) == i).length}`)

        let story = `-- STORIA DEL ${moment().format("DD-MM-YYYY")} --\n\n`
        story += serverstats.onewordstory.words.map(x => x.word).join(" ")

        const attachment = await new Discord.MessageAttachment(Buffer.from(story, "utf-8"), `story-${moment().format("DDMMYYYY")}.txt`);

        client.channels.cache.get("1003566272803504138").send("2 - prima di mandare")

        client.channels.cache.get(settings.idCanaliServer.onewordstory).send({ embeds: [embed], files: [attachment] })
            .then(msg => {
                client.channels.cache.get("1003566272803504138").send("2.5 - conferma invio")
                msg.pin()
            })

        client.channels.cache.get("1003566272803504138").send("3 - Dopo aver mandato")

        serverstats.onewordstory.words = []
        serverstats.onewordstory.totWordsToday = 0
        serverstats.onewordstory.totStories++

        updateServer(serverstats)

        client.channels.cache.get("1003566272803504138").send("4 - Aggiornato serverstats")

        let userstatsList = await getAllUsers(client)
        userstatsList.forEach(userstats => {
            if (userstats.onewordstory.totWordsToday != 0) {
                userstats.onewordstory.totWordsToday = 0;
                updateUser(userstats)
            }
        })

        client.channels.cache.get("1003566272803504138").send("5 - Aggiornati userstats")

    }
}

module.exports = { newStory }