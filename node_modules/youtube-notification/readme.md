# youtube-notification

youtube-notification is a basic wrapper for [Pubsubhubbub](https://pubsubhubbub.appspot.com/). It allows you to receive YouTube notifications when a channel uploads or modifies a video with a simple subscribe and unsubscribe system.

## Install

```bash
npm install youtube-notification
```

## Example

```javascript
const YouTubeNotifier = require('youtube-notification');

const notifier = new YouTubeNotifier({
  hubCallback: 'https://example.com/youtube',
  port: 8080,
  secret: 'Something',
  path: '/youtube'
});
notifier.setup();

notifier.on('notified', data => {
  console.log('New Video');
  console.log(
    `${data.channel.name} just uploaded a new video titled: ${data.video.title}`
  );
});

notifier.subscribe('channel_1');
```

## Events

- **'subscribe'** - A channel has been verified to begin receiving notifications.
- **'unsubscribe'** - A channel has been verified to stop receiving notifications.
- **'notified'**(_data_) - A channel has uploaded/modified/deleted a video.
  - _data_ is an object which contains the following properties: _video_, _channel_, _published_ and _updated_.

## API

### YouTubeNotifier.constructor(_options_)

_options_ is an object that you may write your own properties to.
The following properties are read by YouTubeNotifier:

- **secret** - A private key used by Pubsubhubbub, it is not required to include this property but it is highly recommended that you do. Defaults to _undefined_
- **hubCallback** - Your ip/domain name that will be used as a callback URL by Pubsubhubbub. It _must_ be in a URL format, _ex: 'https://example.com/'_. This is a **required** property as the default is undefined.
- **middleware** - If you are going to use the notifier with a middle ware. Defaults to _false_.
- **path** - The path on which the server will interact with the hub. Defaults to _'/'_. Not required if you are using the notifier with a middleware.
- **port** - The port Pubsubhubbub will listen on. This must be an open port on your system. Defaults to port _3000_. Not required if you are using the notifier with a middleware.
- **hubUrl** - The URL in which we listen to updates from. This shouldn't be changed unless you know what you're doing.

### YouTubeWatch.setup()

This function will setup a server to interact with Pubsubhubbub. If this function is called after the server has already been setup an error is thrown. If this is used with middleware set to true, an error is thrown.

### YouTubeWatch.listener()

This functions will creates and return an Express middleware handler for PubSubHubbub.

### YouTubeWatch.subscribe(channels=[])

Subscribes to a channel or a list of channels IDs. Channels may either be a string or an array of strings. After each successful channel has been verified to receive updates a _subscribe_ event is ommited.

### YouTubeWatch.unsubscribe(channels=[])

Removes the watch state from a list of channel IDs. Channels may either be a string or an array of strings. After each successful channel has been verified to stop receiving updates an _unsubscribe_ event is ommited.
