const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../config/general/colors.json")
const settings = require("../../config/general/settings.json")
const { getServer } = require("../database/getServer")
const { updateServer } = require("../database/updateServer")

const newStory = async (client) => {
    let date = new Date()
    if (date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
        let serverstats = getServer()

        let embed = new Discord.MessageEmbed()
            .setTitle(":orange_book: Storia terminata")
            .setColor(colors.purple)
            .setDescription("Il tempo per la storia di oggi è **terminato**, ecco tutto quello che avete scritto")
            .addField(":bar_chart: Info", `
Parole scritte: ${serverstats.onewordstory.totWordsToday}
Utente unici partecipanti: ${serverstats.onewordstory.words.filter((v, i, a) => a.findIndex(x => x.user == v.user) == i).length}`)

        let story = `-- STORIA DEL ${moment().format("DD-MM-YYYY")} --\n\n`
        story += serverstats.onewordstory.words.map(x => x.word).join(" ")

        const attachment = await new Discord.MessageAttachment(Buffer.from(story, "utf-8"), `story-${moment().format("DDMMYYYY")}.txt`);

        client.channels.cache.get(settings.idCanaliServer.onewordstory).send({ embeds: [embed], files: [attachment] })
            .then(msg => msg.pin())

        serverstats.onewordstory.words = []
        serverstats.onewordstory.totWordsToday = 0
        serverstats.onewordstory.totStories++

        updateServer(serverstats)
    }
}

module.exports = { newStory }