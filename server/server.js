// requires
var express = require( 'express' );
var app = express();
var path = require( 'path' );
var bodyParser = require( 'body-parser' );
var pg = require( 'pg' );

// set up config for the pool
var config = {
  database: 'todo_list',
  host: 'localhost',
  port: 5432,
  max: 10
}; // end config

// setup pool with this config
var pool = new pg.Pool( config );

// globals
var port = 6789;

// uses
app.use( express.static( 'public' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );

// spin up server
app.listen( port, function ( req, res ) {
  console.log( 'Server up on port:', port );
}); // end app.listen

// base url hit
app.get( '/', function ( req, res ) {
  console.log('Base url hit!');
  res.sendFile( path.resolve( 'public/views/todo.html' ) );
});
