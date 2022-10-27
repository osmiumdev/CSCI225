//
var choices = ""
var frown = "img/frown.png";
var check = "img/mglass.png";

function button1(){

    choices += "y";
    window[choices]();

}

function button2(){

    choices += "n";
    window[choices]();

}

function printAnswer(text, image){

    finishQuestion();
    document.getElementById("message").innerHTML = text;
    document.getElementById("image").src = image;

}

function printQuestion(text){

    document.getElementById("question-header").innerHTML = "Question " + (choices.length + 1) + ":";
    document.getElementById("question").innerHTML = text;

}

function finishQuestion(){

    document.getElementById("question-header").innerHTML = "";
    document.getElementById("question").innerHTML = "All done! Check your answer to the right!";
    document.getElementById("answer").innerHTML = "";

}

function y(){

    printQuestion("Does the engine fire?");

}

function yy(){

    printQuestion("Does the vehicle start and then stall?");

}

function yn(){

    printQuestion("Are the spark plugs sparking?");

}

function yny(){

    printQuestion("Is the fuel reaching the filter?");

}

function ynn(){

    printQuestion("Is the coil sparking?");

}

function ynny(){

    printQuestion("Mechanical distributor?");

}

function ynnyy(){

    printAnswer("Check condenser, points or magnetic pick-up, rotor, or cap damage.", check);

}

function ynnyn(){

    printAnswer("For electronic distribution, see model manual for diagnostic checks.", frown);

}

function ynnn(){

    printQuestion("12V+ is reaching the coil primary?");

}

function ynnny(){

    printAnswer("Test coil for internal short. Check secondary output wire resistance.", check);

}

function ynnnn(){

    printAnswer("Ignition system wiring, voltage regulator.", frown);

}

function ynyy(){

    printQuestion("Is the fuel being injected?");

}

function ynyyy(){

    printAnswer("Single point, check throttle body. Electronic multi-point, separate diagnostic.", frown);

}

function ynyyn(){

    printAnswer("Try starter spray in carb, throttle open.", check);

}

function ynyn(){

    printAnswer("Vapor lock, fuel pump, blockage.", frown);

}

function yyy(){

    printQuestion("Check the OBD port. Does it blink a code?");

}

function yyn(){

    printAnswer("Ignition timing, fuel problem, cranking too slow - battery, starter.", frown);

}

function yyyy(){

    printQuestion("Does the vehicle stall upon releasing the key to run?");

}

function yyyn(){

    printAnswer("Read OBD or OBD II or check for blink code access.", check);

}

function yyyyy(){

    printAnswer("Ignition 'run' circuit or column key switch failure. Ring out with meter.", frown);

}

function yyyyn(){

    printQuestion("Does the vehicle stall in the rain?");

}

function yyyyny(){

    printAnswer("Check for cracked coil, distributor. Check visible electrical arcing running in dark.", check);

}

function yyyynn(){

    printQuestion("Does the vehicle stall when warm?");

}

function yyyynny(){

    printAnswer("Adjust idle, blow out fuel filter, check fuel pump output. Check vacuum leak or sensor failure.", frown);

}

function yyyynnn(){

    printAnswer("On cold stalling, check for stuck choke, EGR. Check for vacuum leak.", check);

}

function n(){

    printQuestion("Does the starter spin?");

}

function ny(){

    printAnswer("Solenoid stuckm not powered. Missing teeth on flywheel.", frown);

}

function nn(){

    printQuestion("Battery reading over 12V?");

}

function nny(){

    printQuestion("Are the terminals cleaned?");

}

function nnyy(){

    printAnswer("With the car in park or neutral, use heavy jumper or screwdriver to bypass starter relay solenoid. Test starter.", check);

}

function nnyn(){

    printAnswer("Clean battery terminals and connectors, engine ground.", check);

}

function nnn(){

    printAnswer("Jump start or pop start car and check if battery is charging.", check);

}
