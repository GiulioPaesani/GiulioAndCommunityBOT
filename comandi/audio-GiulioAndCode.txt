client.on("message", message => {
    if (message.content == "!audio") {
        const voiceChannel = message.member.voice.channel;
        if (voiceChannel) {
            voiceChannel.join()
                .then(connection => {
                    connection.play('audio.mp3'); //Scrivere il nome del file audio nella cartella o il path
                });
        }
        else {
            message.channel.send("No voice channel."); //Messaggio se l'utente non è in nessun canale vocale
        }
    }

})