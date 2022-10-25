dragElement(document.getElementById("pointer"));
updateValues(document.getElementById("pointer"));

function dragElement(elmnt) {
    var pos1 = 0, pos3 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos3 = e.clientX;
      // set the element's new position:
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

        try{ //pass positional info to animator

            animator((elmnt.offsetLeft - pos1));

        } catch (err) {

            console.log(err);

        }

    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }

}

var origRelPx;

function updateValues(elmnt){

    origRelPx = elmnt.offsetLeft;

}

var origMiiWidth = parseInt(getComputedStyle(document.getElementById("mii")).width);
var mii = document.getElementById("mii");

function animator(px){

    var width = ((-0.45 * (origRelPx - px) + origMiiWidth));
    console.log(px);
    console.log(width);

    if(width > 0){ //Resize at different speeds test

        mii.src = "img/mii.png";
        mii.setAttribute('width', width);

    } else if (width < 0){

        mii.src = "img/antimii.png"
        mii.setAttribute('width', -1 * width);

    }
    
}