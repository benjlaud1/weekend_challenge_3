$(document).ready(onReady);

// document load function
function onReady (){
  console.log('jq');
  $('#add-new-item').on( 'click', addTodoItem );
  $('#complete-todo-list').on( 'click', '.toggle-complete', toggleItemComplete );
  // populate the DOM
  getAllTodoItems();
} // end onready

// call server to get all items in todo_list database
function getAllTodoItems () {
  // make ajax call to the server route /getAllTodoItems
  $.ajax({
    url: '/getAllTodoItems',
    type: 'GET',
    success: function ( response ) {
      console.log( 'Back from getAllTodoItems with:', response );
      // loop through array and append to complete-todo-list
      $('#complete-todo-list').empty();
      for (var i = 0; i < response.length; i++) {
        var todoItem = response[i];
        $('#complete-todo-list').append( '<nav class="todo-nav"><input type="checkbox" class="toggle-complete" id="toggle-box-' + i + '" data-id="' + todoItem.id + '"><label>' + todoItem.task + '</label></nav>' );
        if (todoItem.completed) {
          $('#toggle-box-' + i).prop('checked', true);
          $('#toggle-box-' + i).parent().addClass( 'completed' );
        } // end if completed
      } // end for loop
    } // end success
  }); // end ajax GET at /getAllTodoItems
} // end getAllTodoItems

// add todo item to database
function addTodoItem () {
  console.log( 'In addTodoItem' );
  var objectToAdd = {
    task: $('#new-todo-item').val()
  }; // end objectToAdd
  // make ajax call to the server route /addTodoItem
  console.log( 'objectToAdd:', objectToAdd );
  $.ajax({
    url: '/addTodoItem',
    type: 'POST',
    data: objectToAdd,
    success: function ( response ) {
      console.log( 'back from addTodoItem with:', response );
      $('#new-todo-item').val( '' );
      getAllTodoItems();
    } // end success
  }); // end ajax
} // end addTodoItem

// toggle todo item complete, use /toggleComplete/1/true
function toggleItemComplete () {
  console.log( 'In toggleItemComplete' );
  var objectToToggle = {
    id: $( this ).data( 'id' ),
    state: $( this ).prop( 'checked' )
  }; // end objectToToggle
  console.log( 'objectToToggle:', objectToToggle );
  console.log($(this));
  console.log($(this).parent());
  $.ajax({
    url: '/toggleItemComplete/' + objectToToggle.id + '/' + objectToToggle.state,
    type: 'PUT',
    success: function ( response ) {
      console.log( 'Back from toggleItemComplete with:', response );
      getAllTodoItems();
    } // end success
  }); // end ajax
} // end toggleItemComplete
