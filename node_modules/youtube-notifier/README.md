# youtube-notifier
Sends notifications when added channels upload videos. Gets information via YouTube feeds.

## Usage
```js
const ytnotifier = require('youtube-notifier');
const Notifier = new ytnotifier({
    channels: ['A channel ID', 'Another channel ID'],
    checkInterval: 50 /* Interval to check the latest video. */
});

Notifier.on('video', video => {
    console.log(video);
    /*
    video = {
        channelName,
        title,
        publishDate,
        url,
        id
    };
    */
});
```

## Methods

### Notifier.addChannels()
| Parameter | Type | Returns |
| --- | --- | --- |
| channels | array | Promise |

### Notifier.removeChannels()
| Parameter | Type | Returns |
| --- | --- | --- |
| channels | array | Promise |