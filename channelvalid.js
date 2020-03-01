const fs = require('fs');
try { args = fs.readFileSync('.args', 'utf8' ) 
    if (args == '-v') {
        verbose = true
    }
} catch { args = false }

function channelvalid (message, channel) { try {
    /*  Checks for the validity of the channel sent in
        where `message` is the message sent by the user
        who wishes to execute the command and `channel`
        is the channel we want to verify exists

        I optimesed so we can also check the also check 
        the vaildity of the channel that the user sent 
        the message in cuz I was dumbdum and coded 
        before I thought  */                
    let valid = []                                              //where all the valid channels are stored
    message.guild.channels.forEach( (allchannels) => {          //for every single channel we have in the 
        channel.forEach( (mentionedchannels) => {
            if (allchannels.id == mentionedchannels.id) {
                valid.push(mentionedchannels.id)
            }  
        })
        
    })
    verbose ? console.log( Date() + ( valid[0] ? ' Found valid channel' + valid : ' No valid channels found'  )) : ''
    return valid
    } catch (e) {return false;}
}


module.exports = channelvalid