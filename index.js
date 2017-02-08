"use strict";

// Node Modules
var bodyParser = require( "body-parser" );
var childProcess = require( "child_process" );
var config = require( "./config.json" );
var Discord = require( "discord.js" );
var express = require( "express" );

// Apps
var app = express();
var minecraftBot = new Discord.Client();

// Configuration
app.use( bodyParser.text() );


function getPostHandler( channel ){
    var test = new RegExp( config.chatRegExp );
    var ignore = new RegExp( config.ignoreRegExp );

    return ( req, res ) => {
        var match = req.body.match( test );
        var message;

        if( match && !ignore.test( req.body ) ){
            message = "`" + match[1].replace( /(\§[A-Z-a-z-0-9])/g, "" ) + "`: " + match[2];

            channel.sendMessage( message );
        }

        res.status( 200 ).send( "post received with a request body of: " + req.body );
    };
}

function handleRoutes( channel ){
    var postHandler = getPostHandler( channel );

    app.post( config.postRoute, postHandler );
}

function handleChildProcess(){
    var cmd = `tail -F ${config.src}/logs/latest.log | grep --line-buffered ": <" | while read x ; do echo -ne $x | curl -X POST -d @- ${config.protocol}://${config.host}/minecraft/hook ; done`;

    childProcess.exec( cmd );
}

function handleReadyState(){
    var channel = minecraftBot.channels.get( config.channelId );

    handleRoutes( channel );
    handleChildProcess();
}

minecraftBot.on( "ready", handleReadyState );

/* eslint-disable no-console */
minecraftBot
    .login( config.token )
    .catch( console.log );

app.listen( config.port, () => console.log( `listening on port ${config.port}` ) );
