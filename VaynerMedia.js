$(function(){
    //Gets the users from the API
    $.getJSON("https://jsonplaceholder.typicode.com/users?id=1&id=2", function(data){
        var users = data;
        
        //Loop thourgh each user
        for(var i=0; i<users.length; i++){
            var selector = "#user"+(i+1); 
            //Set the name of user above the lists
            $(selector).text(users[i].name);
            //Loads the user's albums and inserts it into the list.
            loadUser(users[i]);
        }
    });
});

/*
* Loads the list of items for a user
*/
function loadUser(user){
    //Gets the album associated with the user
    $.getJSON("https://jsonplaceholder.typicode.com/albums?userId="+user.id, function(data){
            var albums = data;
            //Loop through the albums
            for(var i=0; i<albums.length; i++){
                //create the li element
                var li =  "<li class='item' draggable='true' ondragstart='dragStart(event)' id='"+albums[i].id+"'>"+
                                "<div class='id'>"+albums[i].id+"</div>"+
                                "<div class='title'>"+albums[i].title+"</div>"+
                            "</li>";
                //Append it to the ul for the apporiate user
                $(li).appendTo(user.id === 1? "#user1List" : "#user2List");
            }
        });
}

/*
* Drag start event passes the id of the moved element
*/
function dragStart(ev){
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("text/plain", ev.target.id);
}
/*
* Drag over event changes the cursor to indicate that the user is moving an element
*/
function dragOver(ev){
    ev.preventDefault();
    // Set the dropEffect to move
    ev.dataTransfer.dropEffect = "move";
}

/*
* Event when something is dropped. This will place the element from one list to the other 
* and update the userID of the moved element on the API. If it fails the element wont be moved
*/
function drop(ev){
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    //Sometimes the target is the title element, id element, li element. So this next block will scroll up until we get to the UL which is the target we want
    var targetElement = ev.target;                      //After the while this will be the UL element
    while(targetElement.nodeName != "UL"){
        targetElement = targetElement.parentNode;
    }
    var userID = targetElement.getAttribute("id").substr(4,1);      //Get's the userID from the UL's id attr
    //Removing this portion since it was only required for the coding challenge and it makes the drag and drop run slow since it waits on an ajax response.
    /*
    //Makes an AJAX call to change the user id on the album
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/albums/'+data,
        type: 'PUT',
        dataType: 'json',
        data: {"userId": userID},
        success: function(response){
            //On success append the li element to the target UL
            targetElement.appendChild(document.getElementById(data));
        }
    });//*/
    targetElement.appendChild(document.getElementById(data));
}