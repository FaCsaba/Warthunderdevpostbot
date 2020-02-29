const getNews = require('./getnewposts');
const fs = require('fs');
const Discord = require('discord.js');

function makeBoard(amount, bot) {
    /*  making the Discord embeded board based on the post
        we get from `getNews` where `amount` is the amount
        of posts we want to make and send to the channels,
        `bot` is the Client we have opened                */
    if (amount == 'last' ) {
        amount = 1
        last = true
    }
    getNews(amount)
            .then(function(news) {
                
                function boardComponentsMake() {
                    /* A component maker so we dont have to make the 
                    board twice if we dont only want the last on    */
                
                for (let h = 0 ; h < amount ; h++) {
                    board = new Discord.RichEmbed()                     //making the board itself
                        .setColor("#ff0000")                            //these values are 100% customizable
                        .setTitle(news[h].name)                         //feel free to change it up
                        .setURL(news[h].href)
                        .setDescription(news[h].descr)
                        .setThumbnail(`${encodeURI(news[h].img)}`)
                        .setFooter('v 1.1')
                        
                    servers = fs.readdirSync('./servers/')              //we get the servers we want to send these to
                    for ( let i = 0 ; i < servers.length ; i++ ) {      //where for the amount of servers we have in the servers directory
                        serverFile = (`${fs.readFileSync('./servers/' + servers[i] )}`).split(',')
                        if ( serverFile[0] == "" ) {
                            serverFile = []
                        }
                        for ( let j = 0 ; j < serverFile.length; j++ ) {//times the amount of channels we have in them 
                            bot.channels.get(serverFile[j]).send(board) //we send them 
                        }
                    }
                }}

                lastpost = fs.readFileSync('lastpost', 'utf8')
                if ( last && lastpost !== news[0].name ) {              //we make the board if the latest news saved isnt equal to the one we got from getNews
                    fs.writeFileSync('lastpost', `${news[0].name}`)     //write to the file and make board if so
                    boardComponentsMake()
                } else if ( !last ) {                                   //if we arent looking for the last one
                    
                    boardComponentsMake()
                }
                    
    })
}

module.exports = makeBoard                                              //export the function