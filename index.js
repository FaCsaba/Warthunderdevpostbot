const servermanip = require('./serverlistmanip')                    //Loading the modules for interacting with the serverfiles
const addToServerList = servermanip.addToServerList                 
const removeFromServerList = servermanip.removeFromServerList
const channelValid = require('./channelvalid');
const makeBoard = require('./makeboard')
const args = process.argv
verbose = false
if ( args[2] == '-v' || args[2] == '--verbose') { verbose = true } else if (args[2]) { console.log('unknown positional argument') }
//TODO: add docs for verbose mode

const Discord = require('discord.js');
/*  The API for interacting with Discord itself */

const fs = require('fs');
/*  Filesystem reader */

require('@exan/envreader').load()
/*  Loading from the .env file, think of this as a config file, where we store the discord token */

const TimingService = require('@exan/timing-service')
const timer = new TimingService.TimingService();
/*  The timing service we use for periodically check for news updates */

const bot = new Discord.Client();
/*  Client for interacting with Discord */


if (verbose) { 
    console.log( Date() + ' Starting in verbose mode' ) 
    fs.writeFileSync('.args', '-v')
} else { fs.writeFileSync('.args', '') }

verbose ? console.log( Date() + ' Checking for news every ' + process.env.timeAmount + process.env.timeUnit ) : ''
timer.addEvent(process.env.timeUnit, process.env.timeAmount, 'checkfornewpost');    //setting up the timer, this can easily be something else ex. ('m', 30, 'checkfornewpost') where 'm' can be ms (millisecond) s (second), m (minute), h (hour), d (day)

if (!fs.existsSync('lastpost')) {                                                   //this is the file where we store our latest news
   fs.writeFileSync('lastpost', '');                                                //if lastpost file doesnt exist create it
}

if (!fs.existsSync('./servers')) {                                                  //if no server folder create it
    fs.mkdirSync('./servers/')
}


timer.on('checkfornewpost', async () => {                                           //timer to check for updates
    verbose ? console.log( Date() + ' Checking for news ... \n' ) : ''
    makeBoard( 'last', bot )                                                        //if there is one make the board and update the lastpost
})



bot.on('ready', (e) => { verbose ?  console.log( Date() + ' The bot has successfully logged in\n' )  : console.log('Logged in\n') } )

invoker = process.env.invoker

bot.on('message', async (message) => {                                              //command center
    /*  When the event `message` happens: 
        it checks if there is a server folder for that particular
        server,
        it looks for commands it might recognize

        so far the following commands are present:
        help, add, remove, channels, (last) */

    let command = message.cleanContent.toLowerCase().split(' ');                    //splitting up the recieved message
    if ( command[0] == invoker ) {                                                  // !wt can be changed to anything, if confilcs with other bots, can be changed in .env
        /*  invoker: used to invoke the commands listed here */
        verbose ? console.log( Date() + ' Executing the following command: ' + command[1] + (command[2]?' ' + command[2]:'') + ' by ' + message.author.username + ' with the userid: ' + message.author.id + ', from server: ' + message.guild.id ) : ''
            switch (command[1]) {
                case 'help':
                case    'h':
                    /*  Just a fun little help */
					try {
                        await message.channel.send('`!wt help`: shows this menu\n`!wt add [#channel]`: if no channel specified after, posts devblogs in current channel\n`!wt remove [#channel]`: if no channel specified after, it will no longer post devblogs in current channel\n`!wt channels`: Shows all the channels that are subscribed to dev news');
					} catch (e) { }
					break;
                case 'add':
                case   'a':
                    /*  Adds the mentioned channels after it. If ther are no
                        mentioned channels, it will default to using the channel
                        it was executed in */
                    try {
                        if ( !message.member.hasPermission(["MANAGE_CHANNELS"]) ) {          //check for perms
                            verbose ? console.log( Date() + ' User: ' + message.author.username +' with the userid: '+ message.author.id + ', from server: ' + message.guild.id + ' tried to add a channel but didnt have permission') : ''
                            message.reply('you do not have the permisson to do this')
                            break
                        }
                        if ( command[2] ) {
                            let chnnlid = channelValid(message, message.mentions.channels)  //get if channel is correct with mentioned channels ex. #exaxple-channel                          
                            if ( chnnlid[0] ) {
                                verbose ? console.log( Date() + ' Adding mentioned valid ' + (chnnlid > 1 ?'channels ':'channel ' ) + chnnlid + ' to serving list') : ''
                                addToServerList(message, chnnlid)                           //if valid add to channel list
                                verbose ? console.log( Date() + ' Now serving ' + ((fs.readdirSync('./servers')).length > 1 ? fs.readdirSync('./servers').length + ' servers' : fs.readdirSync('./servers').length + ' server')) : '' 
                            } else {
                                await message.channel.send('Invalid channel: ' + command[2]);
                            }
                        } else if ( !command[2] ) {                                         //no channels mentioned, using current as default
                            chnnlid = [message.channel.id]
                            verbose ? console.log( Date() + ' No channels mentioned, adding current channel, ' + chnnlid + ', to serving list') : ''
                            addToServerList(message, chnnlid)                               //if valid add to channel list
                            verbose ? console.log( Date() + ' Now serving ' + ((fs.readdirSync('./servers')).length > 1 ? fs.readdirSync('./servers').length + ' servers' : fs.readdirSync('./servers').length + ' server')) : ''
                        } else {
                            await message.channel.send('Invalid channel: ' + command[2]);
                        }
                    } catch (e) { }
                    break;
                case 'remove':
                case      'r':
                    /*  Removes the mentioned channels after it. If ther are no
                        mentioned channels, it will default to using the channel
                        it was executed in */
                    try {
                        if ( !message.member.hasPermissions(["MANAGE_CHANNELS"]) ) {        //check for perms
                            verbose ? console.log( Date() + ' User: ' + message.author.username +' with the userid: '+ message.author.id + ', from server: ' + message.guild.id + ' tried to remove a channel but didnt have permission') : ''
                            message.reply('you do not have the permisson to do this')
                            break
                        }
                        if ( command[2] ) {                                                 //same with adding channels to the channel list
                            let chnnlid = channelValid(message, message.mentions.channels)                           
                            if ( chnnlid[0] ) {
                                verbose ? console.log( Date() + ' Removing mentioned valid ' + (chnnlid.length > 1 ?'channels ':'channel ' ) + chnnlid + ' from serving list') : ''
                                removeFromServerList(message, chnnlid)
                                verbose ? console.log( Date() + ' Now serving ' + ((fs.readdirSync('./servers')).length > 1 ? fs.readdirSync('./servers').length + ' servers' : fs.readdirSync('./servers').length + ' server')) : ''
                            } else {
                                await message.channel.send('Invalid channel: ' + command[2]);
                            }
                        } else if (!command[2]) {
                            chnnlid = [message.channel.id]
                            verbose ? console.log( Date() + ' Removing valid ' + (chnnlid.length > 1 ?'channels ':'channel ' ) + chnnlid + ' from serving list') : ''
                            removeFromServerList(message, chnnlid)
                            verbose ? console.log( Date() + ' Now serving ' + ((fs.readdirSync('./servers')).length > 1 ? fs.readdirSync('./servers').length + ' servers' : fs.readdirSync('./servers').length + ' server')) : ''
                        } else {
                            await message.channel.send('Invalid channel: ' + command[2]);
                        }
                    } catch (e) { }
                    break;
                case 'test':
                    try {
                        message.reply('You just found the super secret test command :hammer_pick: :partying_face: :tada:');
                    } catch (e) { }
                    break;
                case 'channels':
                case        'c':
                    /*  Shows which channels will recive updates */
                    try {
                        let channels = []
                        serverFile = (`${fs.readFileSync('./servers/' + message.guild.id )}`).split(',')    //reading the input and putting it in a list for easier manipulation
                        if ( serverFile == "" ) {
                            serverFile = []
                        }
                        for ( let j = 0 ; j < serverFile.length; j++ ) {
                            channels.push(' <#' + serverFile[j] + '>')                      //putting channels in '<#CHANNEL>' so its linking to the channel
                        }
                        if ( channels[0] ) {
                            message.reply('Subscribed in the following channels:' + channels)
                        } else {
                            message.reply('You are not subscribed in any channels \:(\nMaybe try: `!wt add [#CHANNEL]`')
                        }
                    } catch (e) { }
                    break;
                // case 'last':                                                             //uncomment if you want to use it
              ///* shows the last (max) 15 posts from the dev blog */
              //       try {
              //           if ( command[2] ) {
              //              if ( parseInt(command[2]) > 12 ) {
              //                  message.reply('Maximum of last 12 dev posts are allowed.\nShowing last 12.')
              //              }
              //              makeBoard( parseInt(command[2]), bot, message.channel.id )
              //    
              //           }  else {
              //               makeBoard(1, bot, message.channel.id)
              //           }
              //       } catch (e) {}
              //     break;
                default:                                                                    //the command after is not in any of these
                    try {
						await message.channel.send('Unknown command, perhaps try `!wt help`');
					} catch (e) { }
					break;
			}
    }
})

bot.login(process.env.discord_token)                                                        //logging in with the bot. the process.env.discord_token can be changed in the .env file