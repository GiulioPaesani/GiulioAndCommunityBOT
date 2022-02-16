module.exports = {
    name: "profilo",
    aliases: ["illustrazioni"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Come ho realizzato il mio avatar e le mie illustrazioni",
    syntax: "!profilo",
    category: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var embed = new Discord.MessageEmbed()
            .setTitle(":frame_photo: Le mie ILLUSTRAZIONI :frame_photo:")
            .setThumbnail("https://i.postimg.cc/3xLMLxNH/Profilo-composition.png")
            .setDescription(`Ecco come ho realizzato il mio **avatar** e le mie **illustrazioni**`)
            .addField(":globe_with_meridians: Sito", `
https://stubborn.fun/
Attraverso questo sito ho scaricato tutte le **risorse** e immagini necessarie, per poi comporle e mettere assieme in **Photoshop** e **Illustrator**`)
            .addField(":video_camera: Video", `
Guarda il questo [video completo](https://youtu.be/mT-G-bRIREc) in cui mostro nel **dettaglio** come ho realizzato tutto ciò`)

        message.channel.send({ embeds: [embed] })
            .catch(() => { })
    },
};