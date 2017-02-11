/**
 * Created by mvill on 2/8/2017.
 */

function callSnackbar(displayText){
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = displayText;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function hideShow(divID) {

    var dfaDiv = document.getElementById(divID);

    if(dfaDiv.style.display == 'block')
        dfaDiv.style.display = 'none';
    else
        dfaDiv.style.display = 'block';

}

function reverse(s){
    return s.split("").reverse().join("");
}