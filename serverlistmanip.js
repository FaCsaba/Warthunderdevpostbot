const fs = require('fs');

function addToServerList (message , channelid ) {
    /* Adding to the server list */
    let includes = []
    let alreadyIncludes = []
    server = message.guild.id                                       //get what server we are in with the help of the message
    serverFile = fs.readFileSync('./servers/' + server, 'utf8' )    //the the file our server channels are
    if ( serverFile != "" ) {                                       
    serverFile = serverFile.split(',')                              //if we read nothing from the file it will still be split, thus resulting in a "" at [0]
    } else { serverFile = [] }                                      //we prevent this

    for ( let i = 0 ; i < channelid.length; i++ ) {                 //for the amount of channels we want to add to our server file
        if (serverFile.includes(`${channelid[i]}`)) {               //if we already have it, push it to the alreadyIncluded list with <#CHANNELID> thus it is linked on Discord
            alreadyIncludes.push(' <#' + channelid[i] + '>')
        } else {
            serverFile.push( `${channelid[i]}` )                    //else we just push it into the file
            includes.push(' <#' + channelid[i] + '>')               //same here with alreadyIncluded
            fs.writeFileSync( './servers/' + server, `${serverFile}`, 'utf8' )
        }
    }
    if ( includes[0] ) {                                            //we send some data back
        message.reply( includes + (includes[1] ? ' are' : ' is') + ' now getting Warthunder news updates')
    }
    if ( alreadyIncludes[0] ) {
        message.reply( alreadyIncludes + (alreadyIncludes[1] ? ' are' : ' is' ) + ' already getting news updates')
    }
}

function removeFromServerList (message , channelid) {
    let removed = []
    let alreadyRemoved = []
    server = message.guild.id
    serverFile = fs.readFileSync( './servers/' + server, 'utf8' )   //read from the file
    if ( serverFile != "" ) {
    serverFile = serverFile.split(',')       
    } else { serverFile = [] }
    for ( let i = 0 ; i < channelid.length; i++ ) {                 //for the amount of channels we want to remove
        if (serverFile.includes(channelid[i])) {                    //if there is one remove it
            index = serverFile.indexOf(channelid[i])
            if (index > -1) {
                serverFile.splice(index, 1);
            }


            removed.push(' <#' + channelid[i] + '>')
            fs.writeFileSync('./servers/' + server, `${serverFile}`, 'utf8' )

        } else {                                                    //else complain that it has already been removed
            alreadyRemoved.push(' <#' + channelid[i] + '>')
        }
    }
    if ( removed[0] ) {                                             //send the feedback
        message.reply( removed + (removed[1] ? ' are' : ' is') + ' now not getting Warthunder dev news')
    }
    if ( alreadyRemoved[0] ) {
        message.reply( alreadyRemoved + (alreadyRemoved[1] ? ' are' : ' is' ) + ' already removed from news updates')
    }
}


module.exports.addToServerList = addToServerList                    //exporting our functions
module.exports.removeFromServerList = removeFromServerList 