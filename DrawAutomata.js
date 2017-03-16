/**
 * Created by mvill on 1/27/2017.
 */

var dfaAutomata = new Automata("dfa");
var nfaAutomata = new Automata("nfa");
var emptyA = new Automata("dfa");
var turingAutomata = new Automata("turing");

var savedAutomata;

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

        var definedAutomata = defineAutomata();

    if(shiftKey || ctrlKey || altKey){

        var stateName = prompt("State name", "State");

        if(stateName != null){
            if(shiftKey && ctrlKey)
                auxCreateState(definedAutomata, stateName,"IF", "#ccff66"); //INITIAL FINAL
            else if(shiftKey)
                auxCreateState(definedAutomata, stateName,"F", "#00ff99"); //FINAL SHIFT
            else if(ctrlKey)
                auxCreateState(definedAutomata, stateName,"I", "#66a3ff"); //INITIAL CONTROL
            else if(altKey)
                auxCreateState(definedAutomata, stateName,"N", "#808080"); //NORMAL ALT
        }
    }
}

function addTransition(automataId) {

    var automata = defineAutomata();

    if(automata.type != "turing"){
        var transitionData = prompt("Define transition", "0,a,b");

        if(transitionData != null){
            var dataArray = transitionData.split(",");
            var originState = dataArray[1];
            var nextState = dataArray[2];
            auxCreateEdge(automata, dataArray[0], originState, nextState, automataId);
        }else
            callSnackbar("Invalid input");  
    }else{
        var transitionData = prompt("Defina transition", "Origin,Tape,New Tape,Direction,Next");

        if(transitionData != null){
            var dataArray = transitionData.split(",");
            var originState = dataArray[0];
            var currentTape = dataArray[1];
            var newTape = dataArray[2];
            var direction = dataArray[3];
            var nextState = dataArray[4]; 
            createTuringEdge(originState, currentTape, newTape, direction,nextState, automata);
        }else
            callSnackbar("Invalid input");
    }
    

}

function defineAutomata() {

    if(document.getElementsByName('automataR')[0].checked)
        return dfaAutomata;
    else if(document.getElementsByName('automataR')[1].checked)
        return nfaAutomata;
    else if(document.getElementsByName('automataR')[4].checked)
        return turingAutomata;
    else
        alert("Not implemented");
}

function acceptString(testString, turingTape) {
    var result;
    var automata =  defineAutomata();

    if(automata.type == "dfa")
        result =  evaluateDFA(testString,automata);
    else if(automata.type == "nfa")
        result = evaluateNFA(testString, automata);
    else if(automata.type == "turing")
        result = evaluateTuring(testString, turingTape, automata);
    
    if(result == true)
        alert("The string was accepted! :D");
    else
        if(automata.type != "turing")
            alert("The string was NOT accepted :(");

    if(automata.type == "turing")
        alert("Tape: " + result);
}

function convertNfaToDfa() {

    auxNfa = nfaAutomata;

    clearDiagram();

    dfaAutomata = nfaToDfa(auxNfa);

    document.getElementById("nfa2dfa").style.display = 'none';
    document.getElementsByName('automataR')[0].checked = "true";

}

function saveAutomata(){

    saveAutomata = defineAutomata();

    nfaAutomata.network = null;
    dfaAutomata.network = null;

    dfaAutomata = new Automata("dfa");
    nfaAutomata = new Automata("nfa");

    clearDiagram();

    callSnackbar("Automata saved");

}

function loadAutomata(){
    clearDiagram();
    init(saveAutomata);
}

function clearDiagram(){

    var container = document.getElementById('automataDiagram');
           
    var data = {
        nodes: emptyA.nodes,
        edges: emptyA.edges
    };
    var options = {};

    dfaAutomata.network = new vis.Network(container, data, options);
    nfaAutomata.network = new vis.Network(container, data, options);

    dfaAutomata = new Automata("dfa");
    nfaAutomata = new Automata("nfa");

}

function load(aString){

    var nuAutomata = defineAutomata();
    var textAutomata = aString;//"a,I|b,N|c,N|d,N|e,F*a,0,a|a,0,b|a,0,c|a,0,d|a,0,e|a,1,d|a,1,e|b,0,c|b,1,e|c,1,b|d,0,e";
    var statesTransitions = textAutomata.split("*");
    var states = statesTransitions[0].split("|");
    var transitions = statesTransitions[1].split("|");

    for(var i = 0; i < states.length; i++){
        var node = states[i].split(",");
        auxCreateState(nuAutomata, node[0], node[1]);
    }

    if(nuAutomata.type == "turing")
        for(var k = 0; k < transitions.length;k++){
            var edge = transitions[k].split(",");
            createTuringEdge(edge[0], edge[1], edge[2], edge[3], edge[4], nuAutomata);
        }   
    else{
        for(var j = 0; j < transitions.length;j ++ ){
            var edge = transitions[j].split(",");
            auxCreateEdge(nuAutomata, edge[1], edge[0], edge[2]);
        }
    }

    document.getElementById("automataString").value = "";

}

function makeUnion(){

    var oldDfa = dfaAutomata;
    var saveDfa = saveAutomata;
    var newDfa = dfaAutomata;
    
    if(saveDfa.type == "nfa")
        saveDfa = nfaToDfa(saveDfa);
    
    if(nfaAutomata.stateList.length != 0)
        newDfa = nfaToDfa(nfaAutomata);

    clearDiagram();

    //dfaAutomata = doUnion(saveAutomata, newDfa);

    dfaAutomata = union(saveAutomata, newDfa);

}