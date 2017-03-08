/**
 * Created by mvill on 1/27/2017.
 */

var dfaAutomata = new Automata("dfa");
var nfaAutomata = new Automata("nfa");

var savedAutomata;

//dvchm

function addState(automataId) {
    var shiftKey = false;
    var ctrlKey = false;
    var altKey = false;

    if(event.shiftKey && event.ctrlKey)
        shiftKey = ctrlKey = true;
    if (event.shiftKey)
        shiftKey = true;
    else if(event.ctrlKey)
        ctrlKey = true;
    else if(event.altKey)
        altKey = true;

        var definedAutomata = defineAutomata()

    if(shiftKey || ctrlKey || altKey){

        var stateName = prompt("State name", "State");

        if(stateName != null){
            if(shiftKey && ctrlKey)
                createState(definedAutomata, stateName,"IF", "#00ff99", automataId); //INITIAL FINAL
            else if(shiftKey)
                createState(definedAutomata, stateName,"F", "#00ff99", automataId); //FINAL SHIFT
            else if(ctrlKey)
                createState(definedAutomata, stateName,"I", "#66a3ff", automataId); //INITIAL CONTROL
            else if(altKey)
                createState(definedAutomata, stateName,"N", "#808080", automataId); //NORMAL ALT
        }
    }
}

function addTransition(automataId) {

    var transitionData = prompt("Define transition", "0,a,b");

    if(transitionData != null){
        var dataArray = transitionData.split(",");
        var originState = dataArray[1];
        var nextState = dataArray[2];
        createEdge(defineAutomata(), dataArray[0], originState, nextState, automataId);
    }else
        callSnackbar("Invalid input");

}

function defineAutomata() {

    if(document.getElementsByName('automataR')[0].checked)
        return dfaAutomata;
    else if(document.getElementsByName('automataR')[1].checked)
        return nfaAutomata;
    else
        alert("Not implemented");
}

function acceptString(testString) {
    var result;
    var automata =  defineAutomata();

    if(automata.type == "dfa")
        result =  evaluateDFA(testString,automata);
    else if(automata.type == "nfa")
        result = evaluateNFA(testString, automata);
    
    if(result)
        alert("The string was accepted! :D");
    else
        alert("The string was NOT accepted :(");
}

function convertNfaToDfa() {

    console.log(nfaAutomata);

    nfaToDfa(nfaAutomata);
}

function saveAutomata(){

    saveAutomata = defineAutomata();

    nfaAutomata.network = null;
    dfaAutomata.network = null;

    dfaAutomata = new Automata("dfa");
    nfaAutomata = new Automata("nfa");

    callSnackbar("Automata saved");

}

