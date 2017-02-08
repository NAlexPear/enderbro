"use strict";

// Node Modules
var bodyParser = require( "body-parser" );
var config = require( "./config.json" );
var Discord = require( "discord.js" );
var express = require( "express" );
var request = require( "request" );
var Rcon = require( "modern-rcon" );
var Tail = require( "tail" ).Tail;

// Apps
var app = express();
var minecraftBot = new Discord.Client();
var tail = new Tail(
    `${config.src}/logs/latest.log`,
    { "follow": true }
);

// Configuration
var players = config.playerMap;

app.use( bodyParser.json() );

function getPlayerById( id ){
    return Object
        .keys( players )
        .filter(
            ( handle ) => players[ handle ] == id
        )[0];
}

function getPlayerByHandle( handle ){
    var user = handle;
    var id = players[ handle ];

    if( id ){
        user = minecraftBot.users.get( id );
    }

    return user;
}

function getPostHandler( channel ){
    var test = new RegExp( config.chatRegExp );
    var ignore = new RegExp( config.ignoreRegExp );

    return ( req, res ) => {
        var match = typeof req.body.message === "string" ? req.body.message.match( test ) : "";
        var message;
        var handle;
        var user;

        if( match && !ignore.test( req.body ) ){
            handle = match[1].replace( /(\§[A-Z-a-z-0-9])/g, "" );
            user = getPlayerByHandle( handle );
            message = "`" + user + "`: " + match[2];


            channel.sendMessage( message );
        }

        res.status( 200 ).send( "post received with a request body of: " + req.body );
    };
}

function handleRoutes( channel ){
    var postHandler = getPostHandler( channel );

    app.post( config.postRoute, postHandler );
}

function postTail( data ){
    var reqObject = {
        "url": config.endpoint,
        "method": "POST",
        "json": true,
        "body": { "message": data }
    };

    if( data.match( /: </ ) ){
        request( reqObject );
    }
}
function handleReadyState(){
    var channel = minecraftBot.channels.get( config.channelId );

    handleRoutes( channel );

    tail.watch();
    tail.on( "line", postTail );
}

function handleIncomingMessage( message ){
    var player = getPlayerById( message.author.id ) || message.author.username;
    var isCorrectChannel = message.channel.id == config.channelId;
    var isNotBot = message.author.id != minecraftBot.user.id;
    var rcon = config.rcon;
    var { host, port, password, timeout } = rcon;
    var client;

    if( isCorrectChannel && isNotBot ){
        client = new Rcon( host, port, password, timeout );

        client
            .connect()
            .then(
                () => client.send( `say <${player}> ${message.content}` )
            )
            .then(
                () => client.disconnect()
            )
            /* eslint-disable no-console */
            .catch( console.log );
    }
}

minecraftBot.on( "ready", handleReadyState );

minecraftBot.on( "message", handleIncomingMessage );

/* eslint-disable no-console */
minecraftBot
    .login( config.token )
    .catch( console.log );

app.listen( config.port, () => console.log( `listening on port ${config.port}` ) );
