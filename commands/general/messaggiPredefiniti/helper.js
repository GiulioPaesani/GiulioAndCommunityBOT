const Discord = require("discord.js");
const ms = require("ms");
const moment = require("moment")

module.exports = {
        name: "ciao",
        aliases: ["prova"],
        onlyStaff: false,
        channelsGranted: ["801019779480944660"],
        async execute(message, args, client) {
                const { MessageButton } = require('discord-buttons');
                const { MessageActionRow } = require('discord-buttons')


                var button = new MessageButton()
                        .setLabel("Candidati")
                        .setStyle("green")
                        .setID("candidatiHelper")

                await message.channel.send(`
:man_raising_hand: **Diventa AIUTANTE** :woman_raising_hand:
Sei una persona vogliosa e capace di aiutare gli altri? Hai una buona conoscenza nell'ambito della programmazione?
**Candidati** subito a diventare <@&859413877133410335> all'interno del server
`, { files: ["https://i.postimg.cc/4ycdfBbW/Banner.jpg"] })



                await message.channel.send(`
:question: Cosa vuol dire essere AIUTANTI?
Il vostro incarico sarà quello di **aiutare** e **spiegare**, cercando di risolvere, piccoli problemi degli utenti nel server, principalmente nell'ambito **Javascript** e **Discord.js **             
** **`)
                await message.channel.send(`
:man_shrugging: Cosa OTTENGO?
Tutti gli aiutanti otterrano:
- Un **ruolo** che li contraddistingua tra i membri
- Vedere tutti i **ticket** di supporto
- Utilizzare la funzione "**here**" del comando \`!code\`, mandando il codice direttamente in chat 
- Una **chat privata** per parlare con lo staff   
** **       
`)
                await message.channel.send(`
:envelope_with_arrow: Come CANDIDARSI
Per candidarsi vi basterà cliccare sul bottone qua sotto "**CANDIDATI**" per iniziare a compilare un **form**.
Dovrete rispondere e compilare diverse domande, sia **PERSONALI** che **TEORICHE**, in modo che lo staff riesca a trovare le persone giuste per questo ruolo
:warning: _È possibile candidarsi solo se si ha raggiunto il Level 15 (Server boost non valido)_
** **       
`)
                await message.channel.send(`
Dopo esservi candidati, lo staff il prima possibile leggerà la vostra proposta, e se verrete scelti, inzierete il "**periodo di prova**".
Per almeno una settimana riceverai il ruolo <@&862600976798842880> che avrà gli stessi privilegi del ruolo originale.
Al termine di questo periodo, verrà deciso se sei la persona giusta, ricevendo il ruolo Aiutante, oppure se non fai per noi   
** **       
`)
                await message.channel.send(`
:point_down: Insomma basta chiacchiere, candidati subito con il bottone qua sotto
`, button)
        },
};
