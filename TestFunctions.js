/**
 * Created by mvill on 2/8/2017.
 */

function callSnackbar(displayText){
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = displayText;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function auxPrintStates(automata) {
    for(var i  = 0; i < automata.stateList.length; i++)
        console.log(automata.stateList[i]);

}

function printTransitions(automata){
    for(var i = 0; i < automata.transitionList.length; i++)
        console.log(automata.transitionList[i]);
}