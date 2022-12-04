var speed = 1500;           //Time in ms to wait for animations.
var doors = [0, 0, 0];      //[0, 0, 0], with only one value being 1, indicating the win door.
var picks = [0, 0];         //0 = First door chosen, 1 = Second door chosen.
var stats = [0, 0, 0, 0];   //0 = Switch Wins, 1 = Stay Wins, 2 = Switch Losses, 3 = Stay Losses

function stage0(){
    //Resets the game state to the beginning.
    deregisterAllDoors();                                      //Deregisters all doors, cleaning up previous games.
    scrambleDoors();                                           //Set what's behind the doors.
    closeAllDoors();                                           //Closes all doors, cleaning up previous games.
    say("Host: Choose a door!");                               //Print the message to screen.
    for(let i = 0; i < 3; i++){ registerDoor(i, stage1); }     //Registers all doors.
    autoRunCallback(0, 0);                                        //Callback function for autoRun. Only works if it's enabled.

}

function stage1(choice){
    //Once the player chooses the first door, reveal a goat door, and allow for the second choice.
    deregisterAllDoors();                                      //Deregister all doors, disabling them.
    say("Host: Good Choice!");                                 //
    picks[0] = choice;                                         //Saves the players first choice.
    let revealedDoorIndex = 0;                                 //Index of the revealed door for autoRun.
    setTimeout(() => {                                         //Runs the following code after a certain time...

        if(doors[picks[0]] == 0){                              //If the first selection is a goat door, always reveal the other.
    
            for(let i = 0; i < 3; i++){                        //Iterate over every door
    
                if(doors[i] == 0 && picks[0] != i){            //If the current door is a goat, and is not the chosen door
    
                    $('#door' + (i + 1)).attr('src', 'img/montyhall/door_open_goat.png');    
                                                               //Reveal the goat.
                                                               //This door is never registered, so it is not clickable.
                                                               //You aren't allowed to willingly choose the opened goat door.
                    revealedDoorIndex = i;
    
                } else {                                       //If the current door is not a goat...
    
                    registerDoor(i, stage2);                   //Allow the door to be clickable.
                    if(picks[0] == i){ $('#door' + (i+ 1)).unbind('mouseout') }     
                                                               //If this door is the original choice, force it to stay ajar.
                                                               //Instead of deregistering the door, we simply unbind "mouseout"
                                                               //This allows the player to "stay" by clicking the same door again.
    
                }
    
            }
    
        } else {                                               //If the first selection is NOT a goat door (it is the lambo)

            let which = Math.floor(Math.random() * 2);         //Randomly choose the first or second goat door to open.
            for(let i = 0; i < 3; i++){                        //Iterate over every door

                if(picks[0] == i){                             //If this is our chosen door, we know it can't be a goat.

                    registerDoor(i, stage2);                   //Register the door to allow for staying.
                    $('#door' + (i + 1)).unbind('mouseout')    //Force it to stay ajar, as it is our chosen door.

                }
            
                if(which == 0 && doors[i] == 0){               //If this is a goat door, and which is zero, then this is a revealable goat door.
    
                    $('#door' + (i + 1)).attr('src', 'img/montyhall/door_open_goat.png');
                                                               //Reveal the goat.
                                                               //This door is never registered, so it is not clickable.
                                                               //You aren't allowed to willingly choose the opened goat door.
                    which--;                                   //Decrement which, so that if this is the first goat door revealed, the next won't be.
                    revealedDoorIndex = i;
    
                } else if(doors[i] == 0){                      //If this is a goat door, and which is one, skip this door and choose the next goat door.
    
                    which--;                                   //Decrement which so that the next goat is revealed.
                    registerDoor(i, stage2);                   //Register the door to be clickable.
    
                }
        
            }

        }

        say("Host: A goat door is revealed! Click a door to switch or stay!");
        autoRunCallback(1, revealedDoorIndex);


    }, speed);                                                 //Specifies how long to wait for the timer.

}

function stage2(choice){
    //Once the player chooses to switch or stay, reveal all doors.
    deregisterAllDoors();                                      //Disable all doors, as the final decision has been made.
    picks[1] = choice;                                         //Save the user choice.
    if(picks[0] != picks[1]){                                  //If the player chose to switch...
        
        $('#door' + (picks[0] + 1)).attr('src', 'img/montyhall/door_closed.png');  
                                                               //Close the original door.

    }
    say("Host: Time to reveal the prizes!");
    setTimeout(() => {

        revealAllDoors();
        if(doors[picks[1]] == 1){                             //If the last pick is the lambo

            say("Host: Congrats! You won a picture of a lambo!");

        } else {

            say("Host: Aww! You won a cute GNU/Goat!");

        }

        setTimeout(() => {

            say("Host: Click any door to reset!");            //Allow door click to reset
            for(let i = 0; i < 3; i++){ $('#door' + (i + 1)).click(function(){ stage0() }); }  

            //Adds the game result to the statistics array.                                            
            if(doors[picks[1]] == 1){
                if(picks[0] == picks[1]){ stats[1]++; } 
                else { stats[0]++; }
            } else {
                if(picks[0] == picks[1]){ stats[3]++; } 
                else { stats[2]++; }
            }

            updateStatsTable();
            autoRunCallback(2, 0);

        }, speed)

    }, speed);

}

//Returns an array of three values, two zeroes, and one one.
function scrambleDoors(){

    let returnable = [0, 0, 0];
    returnable[Math.floor(Math.random() * 3)] = 1;
    doors = returnable

}

//Change the text above the doors.
function say(text){

    $('#hosttext').text(text);

}

//Registers a door to a default state, enabling interactivity and animations.
function registerDoor(door, func){

    console.log("Registered Door Stage:" + stage + ", Door:" + door);
    $('#door' + (door + 1)).mouseover(function(){ $('#door' + (door + 1)).attr('src', 'img/montyhall/door_ajar.png'); });
    $('#door' + (door + 1)).mouseout(function(){ $('#door' + (door + 1)).attr('src', 'img/montyhall/door_closed.png'); });
    $('#door' + (door + 1)).click(function(){ func(door); }); 

}

//Deregisters a door and disables all interactivity.
function deregisterDoor(door){

    $('#door' + (door + 1)).unbind('mouseover').unbind('mouseout').unbind('click');

}

//Deregisters all doors.
function deregisterAllDoors(){

    for(let i = 0; i <= 3; i++){ deregisterDoor(i); }

}

//Closes all doors.
function closeAllDoors(){

    for(let i = 0; i <= 3; i++){ $('#door' + (i + 1)).attr('src', 'img/montyhall/door_closed.png'); }

}

//Reveals all doors. Also forces them to stay open.
function revealAllDoors(){

    for(let i = 0; i < 3; i++){ revealDoor(i);  }

}

//Sets the door's image to the appropriate picture.
function revealDoor(door){

    if(doors[door] == 0){

        $('#door' + (door + 1)).attr('src', 'img/montyhall/door_open_goat.png');

    } else {

        $('#door' + (door + 1)).attr('src', 'img/montyhall/door_open_lambo.png');

    }

}

//Sets the current statistics values to the table.
function updateStatsTable(){

    $('#t0').text(stats[0]);
    $('#t1').text(stats[1]);
    $('#t2').text(stats[2]);
    $('#t3').text(stats[3]);

    $('#switchwl').text(stats[0] / (stats[0] + stats[2]));
    $('#staywl').text(stats[1] / (stats[1] + stats[3]));

}

//When document is fully loaded, start the game.
$(document).ready(function(){

    $('#spinner').bind('keyup mouseup', function() {
        speed = $('#spinner').val();
    })
    stage0();

})

let doAutoRun = false;

//Processes choices in the game as a player. Entirely random choices.
//Callback function which allows for the automation to play the game.
function autoRunCallback(stage, revealedDoorIndex){

    if(doAutoRun){

        switch(stage){

            case 0:

                let chosenDoor = Math.floor(Math.random() * 3);
                $('#door' + (chosenDoor + 1)).attr('src', 'img/montyhall/door_ajar.png');
                stage1(chosenDoor);      //Chooses a random door.
                break;

            case 1:

                if(Math.floor(Math.random() * 2) == 1){     //50/50 odds.

                    stage2(picks[0]);                       //Stay

                } else {
                                                            //Switch
                    //There has got to be a better way to do this.
                    if(picks[0] == 0) {

                        if(revealedDoorIndex == 1){

                            $('#door' + (2 + 1)).attr('src', 'img/montyhall/door_ajar.png');
                            stage2(2);

                        } else {

                            $('#door' + (1 + 1)).attr('src', 'img/montyhall/door_ajar.png');
                            stage2(1);

                        }

                    } else if(picks[0] == 1){

                        if(revealedDoorIndex == 0){

                            $('#door' + (2 + 1)).attr('src', 'img/montyhall/door_ajar.png');
                            stage2(2);

                        } else {

                            $('#door' + (0 + 1)).attr('src', 'img/montyhall/door_ajar.png');
                            stage2(0);

                        }

                    } else {

                        if(revealedDoorIndex == 0){

                            $('#door' + (1 + 1)).attr('src', 'img/montyhall/door_ajar.png');
                            stage2(1);

                        } else {

                            $('#door' + (0 + 1)).attr('src', 'img/montyhall/door_ajar.png');
                            stage2(0);

                        }

                    }

                }
                break;

            case 2:

                stage0();
                break;

        }

    }

}

//Starts or stops autoRun.
function autoRunToggle(){

    if(doAutoRun){

        doAutoRun = false;
        stage0();

    } else {

        doAutoRun = true;
        stage0();
        autoRun();

    }

}
