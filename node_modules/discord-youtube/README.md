# **discord-youtube**

> _Discord-youtube is an automated, simple Package, which allows you to Easily integrate to your Discord Bot a Youtube Poster._ > _This means, that it logs new Videos, or Streams and sends them to a Channel, you can define the Name, Link, User, and more!_ > _It is very fast and a scraper, so you don't need an API KEY._ > _Also it is up to Date and includes JOSH, so you can decide if you wanna use the DEFAULT, JSON DB, SQLITE or Mongoose_

### Credits

Base is from Tomato's [version](https://github.com/Tomato6966/discord-yt-poster).

## **Installation**

```sh
npm install discord-youtube@latest
```

```js
const YoutubePoster = require("discord-youtube");
//Suggesting to require it once the bot is online, to reduce bugs...
client.on("ready", () => client.YTP = new YoutubePoster(client));
//use the methods
client.YTP.<Method>(<Options>); //returns -> Promise -> <OBJECT/ARRAY -- CHANNEL DATA>
//The logging is the package doing for you, you just need to use the setChannel() function in order to set the first channel which should get listened to!
```

## 📫 **Join our [Discord Server](https://discord.gg/h7Y8YRMXu9) for Support**

---

# 🗂 **For more help view [Documentation](https://github.com/tovade/discord-youtube/wiki)**

# [🧾 See the **Table of Content**, before you START!](https://github.com/tovade/discord-youtube/wiki/🧾-Table-of-Content)

---

## 😎 **Features**

> - ⭐️ **No Api Key needed - scraping**
> - 🛠 **Easy to use**
> - 👀 **Faster then light**
> - 💪 **Up to Date**
> - 🤙 **Infinite Channels, with infite amount of options**
> - 🤖 **Flexible**

---

## 🧠 **Methods**

> - [**See all Methods**](https://github.com/tovade/discord-youtube/wiki/Methods)

---

## 🥰 **Examples**

> - [**Basic Example Bot**](https://github.com/tovade/discord-youtube/wiki/Basic-Example-Bot)
> - [**Example with all Commands**](https://github.com/tovade/discord-youtube/wiki/Example-with-all-Commands)

---

## 🤩 **Responses**

> - [**See all Responses**](https://github.com/tovade/discord-youtube/wiki/Responses)
