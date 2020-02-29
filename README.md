![Warthunder Bot Logo](https://static.warthunder.com/i/modern/logo-short.png?1g)

<h2 align="center">A Warthunder Devblog Discord bot</h2>

## Overview

This bot gives you news updates whenever the devs post blogs from 

## Installation and Usage

### Installation

You will need the following:
<h2 align="center">**[node.js](https://nodejs.org/en/download/)** | **[a Discord token](https://discordapp.com/developers/applications)**</h2>


-Get **[node.js](https://nodejs.org/en/download/)**
-Get a Discord token, place it in a _.env_ file an example is provided, you just have to remove the ```.example``` after it
-Clone or download the file from Github
-Unzip it
-install everything with ```npm i```

You have yourself a bot

you can run it if you are in the directory type ```node index.js``` in your terminal ~~on windows its ```cmd``` in your start menu~~

### Usage

```text
!wt - this is the prefix with which you invoke everything
```


```text
>PREFIX add | >PREFIX a - adds the channel(s) to the list of channels that are recieving the dev blog posts
>PREFIX remove | >prefix r - removes the channel(s) from this list
>PREFIX channel | >PREFIX c - show the channel(s) that are recieving said dev posts
>PREFIX help | >PREFIX h - a cheeky little help command so you dont forget these
```

The enviremental variables can be easily changed in ```.env```


```js
discord_token=YOUR_TOKAN_HERE
timeUnit=s
timeAmount=60
invoker=!wt
```

's' is the time unit, can be 'ms' as in millisecond, 's' as in second, 'm' for minutes, and 'h' for hours.
60 the amount of time we multiply 's' or 'm' or 'h' with. In this example this would mean we wait 60 seconds for the event that checks for the news
