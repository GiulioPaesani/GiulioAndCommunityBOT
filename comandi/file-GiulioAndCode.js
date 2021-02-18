client.on("message", message => {
    if (message.content == "!comando") {
        //Per mandare un singolo file
        message.channel.send("File:", { files: ["file.jpeg"] });
        //Per mandare più file alla volta
        message.channel.send("File:", { files: ["file.jpeg", "file2.jpg"] });
    }
})