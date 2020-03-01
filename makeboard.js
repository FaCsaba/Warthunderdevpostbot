const getNews = require('./getnewposts');
const fs = require('fs');
const Discord = require('discord.js');

try { args = fs.readFileSync('args', 'utf8' ) 
    if (args == ('-v' || '--verbose')) {
        verbose = true
    }
} catch { args = false }

function makeBoard(amount, bot, channel) {
    /*  making the Discord embeded board based on the post
        we get from `getNews` where `amount` is the amount
        of posts we want to make and send to the channels,
        `bot` is the Client we have opened                */
    if (amount == 'last' ) {
        amount = 1
        last = true
    } else { last = false }
    getNews(amount)
            .then(function(news) {
                
                function boardComponentsMake(channels) {
                    /* A component maker so we dont have to make the 
                    board twice if we dont only want the last one   */
                
                    for (let h = 0 ; h < amount ; h++) {

                        board = new Discord.RichEmbed()                 //making the board itself
                            .setColor("#ff0000")                        //these values are 100% customizable
                            .setTitle(news[h].name)                     //feel free to change it up
                            .setURL(news[h].href)
                            .setDescription(news[h].descr)
                            .setThumbnail(`${encodeURI(news[h].img)}`)
                            .setFooter('bot: v 1.1                                                                                                               Posted at: ' + (news[h].date))
                            
                        for ( let j = 0 ; j < channels.length; j++ ) {  //times the amount of channels we have in them 
                            bot.channels.get(channels[j]).send(board)   //we send them 
                        }
                    }
                }

                lastpost = fs.readFileSync('lastpost', 'utf8')
                last ? ( verbose ? console.log( Date() + ' Got ' + news[0].name + ', the last saved one was: ' + lastpost ) : '') : ''
                if ( last && lastpost !== news[0].name ) {              //we make the board if the news we have saved isnt equal to the one we got from getNews
                    
                    
                    
                    servers = fs.readdirSync('./servers/')              //we get the servers we want to send the boards to
                    for ( let i = 0 ; i < servers.length ; i++ ) {      //and the channels in those servers
                        serverFile = (`${fs.readFileSync('./servers/' + servers[i] )}`).split(',')
                        if ( !serverFile[0] == "" ) {
                            fs.writeFileSync('lastpost', `${news[0].name}`)     //write the our newest post to file if there are servers to send to
                        } else {
                            serverFile = []
                        }
                        
                    }
                    verbose ? console.log( Date() + ' Sending boards to channels: ' + serverFile ) : ''

                boardComponentsMake(serverFile)

                } else if ( !last ) {                                   //if we arent looking for the last one
                    news.reverse()                                      //make it but with a backwards list so it appears in chronological order
                    boardComponentsMake([channel])                      //we only want to send this to one channel
                }
                    
    })
}

module.exports = makeBoard                                              //export the function