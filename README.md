# Enderbro

### Your Minecraft-Discord chat connection

---

Enderbro is heavily inspired by [shulker](https://github.com/destruc7i0n/shulker), and operates in much the same way. This package is built primarily on top of [Discord.js](https://github.com/hydrabolt/discord.js/) and [modern-icon](https://github.com/levrik/node-modern-rcon). Many thanks to the authors of all of those packages.

---

## Usage

If everything is working correctly, Enderbro should work like so:

![discord-irc](http://s.thedestruc7i0n.ca/p/I5anbg.gif)

### Installing

Clone this repository and run `npm install` to set things up.

### Configuring

Enderbro requires a configuration file called `config.json` in the same directory as `index.js`. An example configuration file might look like this:

```json
{
    "port": "3000",
    "token": "YOUR-TOKEN-HERE",
    "channelId": "YOUR-CHANNEL-ID-HERE",
    "endpoint": "http://your-endbro-installation.com/your/post/route",
    "postRoute": "/minecraft/hook",
    "src": "/path/to/your/minecraft/server/logs",
    "chatRegExp": "\\[Server thread/INFO\\]: <([^>]*)> (.*)",
    "ignoreRegExp": "packets too frequently",
    "rcon": {
        "host": "localhost",
        "port": 25575,
        "password": "hunter2",
        "timeout": 5000
    },
    "playerMap": {
        "minecraftPlayer1": "123456789101112131",
        "minecraftPlayer2": "123456789101112132",
        "minecraftPlayer3": "123456789101112133"
    }
}
```

### Running

Once everything is installed and your `config.json` is ready to go, then you can run the application from the cloned directory with `node index.js`. It is strongly recommended that you use a process manager like [pm2](https://github.com/Unitech/pm2) to run Enderbro as a background process.

---

## Contributing

Pull requests, bug reports, and feature requests are all welcome! To contribute to Enderbro, please fork this repository, create a new feature branch and submit a pull request to the `master` branch.
