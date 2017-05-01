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
var todoArray = [];

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
}); // end base url get

// addTodoItem POST
app.post( '/addTodoItem', function ( req, res ) {
  console.log( 'In addTodoItem route' );
  // connect to DB
  pool.connect( function ( err, connection, done ) {
    // check if there's an error
    if ( err ) {
      console.log( err );
      res.sendStatus( 400 );
    } else {
      console.log( 'sent to db' );
      connection.query( "INSERT INTO todo_list_table ( task ) VALUES ( $1 );", [ req.body.task ] );
      done(); // closes connection
      res.sendStatus( 201 );
    } // end else if
  }); // end pool.connect
}); // end addTodoItem

// getAllTodoItems GET
// get all todo items from the databse and push them into an array
app.get( '/getAllTodoItems', function ( req, res ) {
  console.log( 'In getAllTodoItems route' );
  // empty array
  todoArray = [];
  pool.connect( function ( err, connection, done ) {
    if ( err ) {
      console.log( err );
      res.sendStatus( 400 );
    } else {
      var resultSet = connection.query( "SELECT * FROM todo_list_table ORDER BY id;" );
      resultSet.on( 'row', function ( row ) {
        todoArray.push( row );
      }); // end resultSet on 'row'
      resultSet.on( 'end', function () {
        done();
        console.log( 'Sending todoArray with:', todoArray );
        res.send( todoArray );
      }); // end resultSet on end
    } // end if else
  }); // end pool.connect
}); // end getAllTodoItems GET

app.put( '/toggleItemComplete/:id/:completed', function ( req, res ) {
  console.log( 'In toggleItemComplete route' );
  var objectToToggle = {
    id: req.params.id,
    completed: req.params.completed
  };
  console.log( 'objectToToggle', objectToToggle );
  pool.connect( function ( err, connection, done ) {
    if ( err ) {
      console.log( err );
      res.sendStatus( 400 );
    } else {
      connection.query( "UPDATE todo_list_table SET completed=$1 WHERE id=$2", [ req.params.completed, req.params.id ] );
      done();
      res.sendStatus( 200 );
    } // end if else
  }); // end pool.connect
}); // end toggleItemComplete PUT

app.delete( '/deleteTodoItem/:id', function ( req, res ) {
  console.log( 'In deleteTodoItem route' );
  pool.connect( function ( err, connection, done ) {
    if ( err ) {
      console.log( err );
      res.sendStatus( 400 );
    } else {
      connection.query( "DELETE FROM todo_list_table WHERE id=$1", [ req.params.id ] );
      done();
      res.sendStatus( 200 );
    } // end if else
  }); // end pool.connect
}); // end deleteTodoItem DELETE
