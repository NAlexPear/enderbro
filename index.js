"use strict";

// Node Modules
var bodyParser = require( "body-parser" );
var config = require( "./config.json" );
var Discord = require( "discord.js" );
var express = require( "express" );
var request = require( "request" );
var Tail = require( "tail" ).Tail;

// Apps
var app = express();
var minecraftBot = new Discord.Client();
var tail = new Tail(
    `${config.src}/logs/latest.log`,
    { "follow": true }
);

// Configuration
app.use( bodyParser.json() );


function getPostHandler( channel ){
    var test = new RegExp( config.chatRegExp );
    var ignore = new RegExp( config.ignoreRegExp );

    return ( req, res ) => {
        var match = typeof req.body.message === "string" ? req.body.message.match( test ) : "";
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

minecraftBot.on( "ready", handleReadyState );

/* eslint-disable no-console */
minecraftBot
    .login( config.token )
    .catch( console.log );

app.listen( config.port, () => console.log( `listening on port ${config.port}` ) );
