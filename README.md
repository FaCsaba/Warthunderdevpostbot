![Warthunder Bot Logo](https://static.warthunder.com/i/modern/logo-short.png?1g)

<h2 align="center">A Warthunder Devblog Discord bot</h2>

## Overview

This bot gives you news updates whenever the devs post blogs from [here](https://warthunder.com/en/news/?tags=Development)

## Installation and Usage

### Installation

You will need the following:

## **[node.js](https://nodejs.org/en/download/)** | **[a Discord token](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)**


- Get **[node.js](https://nodejs.org/en/download/)**;
- Get a Discord token, place it in a _.env_ file. An example is provided, you just have to remove the ```.example``` after it;
- Clone or download the file from Github;
- Unzip it;
- install everything with ```npm i``` in the unziped directory

You have yourself a bot! 

You can run by, still in the unziped directory, typing ```node index.js``` in your terminal

### Usage

```text
!wt - this is the prefix with which you invoke everything
```


```text
>PREFIX add     | >PREFIX a - adds the channel(s) to the list of channels that are recieving the dev blog posts
>PREFIX remove  | >prefix r - removes the channel(s) from this list
>PREFIX channel | >PREFIX c - show the channel(s) that are recieving said dev posts
>PREFIX help    | >PREFIX h - a cheeky little help command so you dont forget these
```

The enviremental variables can be easily changed in ```.env```


```js
discord_token=YOUR_TOKEN_HERE   #This is the token the bot will be using to log in to the bot Client
timeUnit=s                      #May be ms | s | m | h | d
timeAmount=60
invoker=!wt                     #In other word >PREFIX
```

's' is the time unit, can be 'ms' as in millisecond, 's' as in second, 'm' for minutes, and 'h' for hours.
60 the amount of time we multiply 's' or 'm' or 'h' with. In this example this would mean we wait 60 seconds for the event that checks for the news
