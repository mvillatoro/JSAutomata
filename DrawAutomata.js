/**
 * Created by mvill on 1/27/2017.
 */

var states = [10];
var transitions = [10];

var nodeIds, shadowState, nodes, edges, network;

nodeIds = [];
edges = [];
shadowState = true;
nodes = new vis.DataSet();

//region Objects

function State(name, type, stateId) {
    this.stateName = name;
    this.stateType = type;
    this.stateId = stateId;
}

function Transition(transitionChar, originState, nextState) {
    this.transitionChar = transitionChar;
    this.originState = originState;
    this.nextState = nextState;
}

//endregion

//region Create functions

function createNewState(stateType) {

    var stateName = prompt("State name", "State");

    if(stateName != null){
        if(stateType == "IF")
            createState(stateName,"IF", "#00ff99"); //INITIAL FINAL
        else if(stateType == "F")
            createState(stateName,"F", "#00ff99"); //FINAL
        else if(stateType == "I")
            createState(stateName,"I", "#66a3ff"); //INITIAL
        else if(stateType == "N")
            createState(stateName,"N", "#808080"); //NORMAL
    }
}

function createState(stateName, stateType, colorType) {
    var newState = new State(stateName, stateType);
    var text = "State " + stateName + " created";

    if(!stateExist(stateName)){
        states.push(newState);
        var stateId = (Math.random() * 1e7).toString(32);
        console.log("ID: " + stateId);
        addNode(stateId,stateName, colorType);
        callSnackbar(text);
    }else
        callSnackbar("State " + stateName + " already exists...");
}

function createNewTransition() {

    var transitionData = prompt("Transition", "0,a,b");

    var dataArray = transitionData.split(",");
    var originState = getState(dataArray[1]);
    var nextState = getState(dataArray[2]);

    createTransition(dataArray[0], originState, nextState)
}

function createTransition(transitionChar, originState, nextState)   {
    if(originState != null &&  nextState != null){
        if(stateExist(originState.stateName) && stateExist(nextState.stateName)){
            var transition = new Transition(transitionChar, originState, nextState);
            transitions.push(transition);
            createEdge(transitionChar, originState, nextState);
            callSnackbar("Char: " + transitionChar + " Origin: " + originState.stateName + " Next: " + nextState.stateName);
        }
    }else{
        callSnackbar("Invalid input");
    }
}

function addNode(stateId, stateName, color) {
    console.log("ID: " + stateId);
    nodes.add({id:stateId, label:stateName, color: {background:color, border:'black'}});
    nodeIds.push(stateId);
    init();
}

function createEdge(transitionChar, originState, nextState) {
    //var edge = {from: originState.stateId, to: nextState.stateId, label: transitionChar, font: {align: 'horizontal'}};
    //edges = new vis.DataSet(edge);
    //init();
    var transitionId = (Math.random() * 1e7).toString(32);
    edges.push({
        id: transitionId,
        from: originState.stateId,
        to: nextState.stateId,
        label: transitionChar
    });

    init();
}

//endregion


function init() {
    var container = document.getElementById('myDiagramDiv');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {};
    network = new vis.Network(container, data, options);
}


function transitionFunction(initialState, testString) {
    var testChar = testString.charAt(0);
    var lastState;

    if (testString.length > 1) {
        var newTestString =  testString.slice(1,testString.length);
        lastState = extendedFunctionTransition(transitionFunction(initialState, newTestString), testChar);
    }else
    {
        lastState =extendedFunctionTransition(initialState, testChar);
    }

    return lastState;
}

function extendedFunctionTransition(state, testChar) {

    var nextState = getNextState(state, testChar);

    if(nextState[0]!= null)
        return nextState[0];

    return null;

}



function getState(stateName) {
    for(var i = 1; i < states.length; i++){
        if(states[i].stateName == stateName){
            return states[i];
        }
    }

}

function getNextState(state, transitionChar) {
    var nextStates = [];
    for(var i = 1; i< transitions.length; i++){
        console.log(state.stateName);
         if(transitions[i].originState.stateName == state.stateName && transitions[i].transitionChar == transitionChar){
             if(transitions[i].nextState != null){
                 var nextState = getState(transitions[i].nextState.stateName);
                 nextStates.push(nextState);
             }
         }
    }
    return nextStates;
}

function acceptsString(testString) {
    var lastState = transitionFunction(states[1], testString);

    if(lastState!=null){
        if(lastState.stateType == "F" || lastState.stateType == "IF")
            alert("String was accepted :D");
        else
            alert("The string was NOT accepted :(");
    }else {
        alert("The string was NOT accepted :(");
    }

}

function callSnackbar(displayText) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = displayText;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function load(evt) {
    //myDiagram.model = go.Model.fromJson(document.getElementById("jsonFile").value);
}

function save(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function stateExist(stateName) {
    for(var i = 1; i < states.length; i++)
        if(states[i].stateName == stateName)
            return true;

    return false;
}

function printStates() {

    for (var i = 1; i < states.length; i++) {
        console.log(states[i].stateName);
        console.log(states[i].stateType);
    }
}

function printTransitions() {
    for(var i = 1; i < transitions.length; i++){
        console.log(transitions[i].transitionChar);
        console.log(transitions[i].originState);
        console.log(transitions[i].nextState);
    }
}

