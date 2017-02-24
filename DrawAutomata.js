/**
 * Created by mvill on 1/27/2017.
 */

var dfaAutomata = new Automata("dfa");
var nfaAutomata = new Automata("nfa");
var opsDiagramA = new Automata("nfa");
var opsDiagramB = new Automata("nfa");


function addState(divId) {
    var shiftKey = false;
    var ctrlKey = false;
    var altKey = false;

    var automataType = defineAutomata(divId);

    if(event.shiftKey && event.ctrlKey)
        shiftKey = ctrlKey = true;
    if (event.shiftKey)
        shiftKey = true;
    else if(event.ctrlKey)
        ctrlKey = true;
    else if(event.altKey)
        altKey = true;

    if(shiftKey || ctrlKey || altKey){

        var stateName = prompt("State name", "State");

        if(stateName != null){
            if(shiftKey && ctrlKey)
                createState(automataType, stateName,"IF", "#00ff99", divId); //INITIAL FINAL
            else if(shiftKey)
                createState(automataType, stateName,"F", "#00ff99", divId); //FINAL SHIFT
            else if(ctrlKey)
                createState(automataType, stateName,"I", "#66a3ff", divId); //INITIAL CONTROL
            else if(altKey)
                createState(automataType, stateName,"N", "#808080", divId); //NORMAL ALT
        }
    }else
        alert("Alt: Node \nShift: Final \nCtrl: Initial");
}

function addTransition(divId) {

    var transitionData = prompt("Define transition", "0,a,b");

    if(transitionData != null){
        var dataArray = transitionData.split(",");
        var originState = dataArray[1];
        var nextState = dataArray[2];
        createEdge(defineAutomata(divId), dataArray[0], originState, nextState, divId);
    }else
        callSnackbar("Invalid input");

}

function defineAutomata(divId) {

    if(divId == "dfaDiagram")
       return dfaAutomata;
    else if(divId == "nfaDiagram")
        return nfaAutomata;
    else if(divId == "opsDiagramA")
        return opsDiagramA;
    else if(divId == "opsDiagramB")
        return opsDiagramB;
}

function acceptString(testString, divId) {
    var result;
    var automata =  defineAutomata(divId);

    if(automata.type == "dfa"){
        result =  evaluateDFA(testString,automata);
    }else if(document.getElementById("isNfaE").checked){
        result = evaluateNFAE(testString, automata);
        alert("is nfa");
    } else if(automata.type == "nfa"){
        result = evaluateNFA(testString,automata);
    }

    if(result)
        alert("The string was accepted! :D");
    else
        alert("The string was NOT accepted :(");
}

function printSates(divId) {

    var automata = defineAutomata(divId);

    auxPrintStates(automata);
}

function convertNfaToDfa() {
    nfaToDfa(nfaAutomata);
}