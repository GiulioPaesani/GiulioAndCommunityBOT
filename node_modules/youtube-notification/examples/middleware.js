'use strict';
const express = require('express');
const YouTubeNotifier = require('youtube-notification');

const app = express();
const notifier = new YouTubeNotifier({
  hubCallback: 'https://example.com/youtube',
  secret: 'Something',
});

app.use('/youtube', notifier.listener());
app.listen(3000);


notifier.on('subscribe', data => {
  console.log('Subscribed');
  console.log(data);
});

notifier.on('unsubscribe', data => {
  console.log('Unsubscribed');
  console.log(data);
});

notifier.on('denied', data => {
  console.log('Denied');
  console.log(data);
});

notifier.on('notified', data => {
  console.log('New Video');
  console.log(data);
});

notifier.subscribe('channel_1');
notifier.subscribe(['channel_2', 'channel_3']);
