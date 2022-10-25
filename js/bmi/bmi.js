function personalizedMessage(){

    document.getElementById("pmsg").innerHTML = nameBox.value + ", Thank you for using the BMI Calculator by Matt Jones.";

}

function ageWarning(){

    if(ageBox.value < 21){

        document.getElementById("warn").innerHTML = nameBox.value + ", It is recommended to use the BMI Percentile Chart if your age is under 21, located here: <br> <a href='https://www.cdc.gov/growthcharts/data/set1clinical/cj41l023.pdf'>https://www.cdc.gov/growthcharts/data/set1clinical/cj41l023.pdf</a>";

    } else {

        document.getElementById("warn").innerHTML = "";

    }

}

function obesityWarning(bmi){

    if(bmi >= 28){

        document.getElementById("overweight").innerHTML = nameBox.value + ", You are considered overweight, we recommend you to read this document, located here: <br> <a href='http://www.nhlbi.nih.gov/health/public/heart/obesity/lose_wt/control.htm'>http://www.nhlbi.nih.gov/health/public/heart/obesity/lose_wt/control.htm</a>";

    } else {

        document.getElementById("overweight").innerHTML = "";

    }

}

function calcBMI(){

    console.log("calculating...");

    try{

        document.getElementById("err").innerHTML = "";

        var weight = parseFloat(document.getElementById("weight").value);
        var mii = document.getElementById("mii");
        var pointer = document.getElementById("pointer");

        if(isNaN(weight)){ throw new InvalidInput("Weight Input is invalid!"); }

        var heightFeet = parseInt(document.getElementById("feet").value);
        var heightInches = parseInt(document.getElementById("inches").value);

        if(isNaN(heightFeet) || isNaN(heightInches)){ throw new InvalidInput("Height input(s) is invalid!") }

        heightInches = heightInches + (heightFeet * 12);

        var bmi = Math.round((weight / Math.pow(heightInches, 2) * 703) * 100) / 100;

        if(bmi < 18.5){

            mii.style.transform = "scale(0.5, 1)";

        } else if(bmi < 25){

            mii.style.transform = "scale(1, 1)";

        } else if(bmi < 30){

            mii.style.transform = "scale(1.5, 1)";

        } else {

            mii.style.transform = "scale(2, 1)";

        }

        obesityWarning(bmi);
        document.getElementById("bmi").innerHTML = "Your BMI is: " + bmi;


    } catch (err) {

        console.log(err.message);

        if(err instanceof Error && err.code == "INVALID_INPUT"){

            console.log("invalid Inputs");
            console.log(err.message);
            document.getElementById("err").innerHTML = "Invalid inputs! Check and try again!";

        }

    }
    
}

function InvalidInput(message) {
    const error = new Error(message);
    error.code = "INVALID_INPUT";
    return error;
}

var button = document.getElementById("submit");
button.addEventListener("click", calcBMI, false);

var nameBox = document.getElementById('name');
nameBox.addEventListener("blur", personalizedMessage, false);

var ageBox = document.getElementById('age');
ageBox.addEventListener("blur", ageWarning, false);

for(var i = 1; i <= 99; i++) {

    var opt = document.createElement("option");
    opt.textContent = i;
    opt.value = i;
    ageBox.appendChild(opt);

}