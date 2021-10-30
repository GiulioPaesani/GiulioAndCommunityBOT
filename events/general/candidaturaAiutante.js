module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (button.id == "candidatiHelper") {
            var userstats = userstatsList.find(x => x.id == button.clicker.user.id);
            if (!userstats) return

            if (userstats.level < 15) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Diventa AIUTANTE")
                    .setColor("#f68e56")
                    .setDescription(":no_entry_sign: Per candidarsi come **Aiutante** è necessario almeno il **Livello 15**")
                    .setThumbnail("https://i.postimg.cc/ZKghn7NF/Copertina-triste.jpg")

                button.clicker.user.send(embed)
                    .catch(() => { return })
                return
            }

            var embed = new Discord.MessageEmbed()
                .setTitle("Diventa AIUTANTE")
                .setColor("#f68e56")
                .setDescription("Qua potrai candidarti come **AIUTANTE** all'interno del server\rSarà un lavoro duro, quindi buona scelta")
                .addField(":page_facing_up: Come candidarsi", "Ti basta cliccare sul bottone qua sotto per aprire il **form** da compilare\rDovrai rispondere diverse domande sia **personali** che **teoriche** in modo che lo staff possa riuscire a trovare le persone giuste\rQuindi **clicca qua sotto** per iniziare subito")
                .setThumbnail("https://i.postimg.cc/SNjhyFnx/Copertina.jpg")

            let button1 = new disbut.MessageButton()
                .setLabel("Candidati")
                .setStyle("url")
                .setURL("https://forms.gle/J2e7UuquMr9HpKzz8")

            button.clicker.user.send({
                component: button1,
                embed: embed
            }).catch(() => { return })
        }
    },
};
