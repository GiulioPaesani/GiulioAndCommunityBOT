module.exports = {
    name: `ready`,
    async execute() {
        console.log(`-- GiulioAndCommunity BOT è ONLINE! --`);

        client.user.setActivity('!help', { type: 'WATCHING' });

        setInterval(checkModeration, 5 * 1000);

        setInterval(makeBackup, 1000);

        //setInterval(youtubeNotification, 30 * 1000)
    },
};
