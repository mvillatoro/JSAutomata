/**
 * Created by mvill on 1/27/2017.
 */

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

//region DFA

var nodeIds, nodes, edges, network;

var states = [];

var transitions = [];

nodeIds = [];
edges = [];
nodes = new vis.DataSet();

function createNewState() {

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

    if(shiftKey || ctrlKey || altKey){

        var stateName = prompt("State name", "State");

        if(stateName != null){
            if(shiftKey && ctrlKey)
                createState(stateName,"IF", "#00ff99"); //INITIAL FINAL
            else if(shiftKey)
                createState(stateName,"F", "#00ff99"); //FINAL SHIFT
            else if(ctrlKey)
                createState(stateName,"I", "#66a3ff"); //INITIAL CONTROL
            else if(altKey)
                createState(stateName,"N", "#808080"); //NORMAL ALT
        }
    }


}

function createState(stateName, stateType, colorType) {

    if(!stateExist(stateName)){
        var stateId = (Math.random() * 1e7).toString(32);
        var newState = new State(stateName, stateType, stateId);
        states.push(newState);
        addNode(stateId,stateName, colorType);
        callSnackbar("State " + newState.stateName + " created");
    }else
        callSnackbar("State " + stateName + " already exists...");
}

function addNode(stateId, stateName, color) {
    nodes.add({id:stateId, label:stateName, color: {background:color, border:'black'}});
    nodeIds.push(stateId);
    init();
}

function createEdge(transitionChar, originState, nextState) {
    //var edge = {from: originState.stateId, to: nextState.stateId, label: transitionChar, font: {align: 'horizontal'}};
    //edges = new vis.DataSet(edge);
    //init();

    console.log(originState.stateId);
    console.log(nextState.stateId);

    var transitionId = (Math.random() * 1e7).toString(32);
    edges.push({
        id: transitionId,
        from: originState.stateId,
        to: nextState.stateId,
        label: transitionChar,
        color:{color:'rgba(30,30,30,0.2)', highlight:'blue'},
        arrows:'to'
    });

    init();
}

function stateExist(stateName) {
    for(var i = 0; i < states.length; i++)
        if(states[i].stateName == stateName)
            return true;

    return false;
}

function createNewTransition() {

    var transitionData = prompt("Transition", "0,a,b");

    if(transitionData != null){
        var dataArray = transitionData.split(",");
        var originState = getState(dataArray[1]);
        var nextState = getState(dataArray[2]);

        createTransition(dataArray[0], originState, nextState);
    }
}

function createTransition(transitionChar, originState, nextState)       {

    if(originState != null &&  nextState != null){
        transitions.push(new Transition(transitionChar, originState, nextState));
        createEdge(transitionChar, originState, nextState);
        callSnackbar("Char: " + transitionChar + " Origin: " + originState.stateName + " Next: " + nextState.stateName);
    }else{
        callSnackbar("Invalid input");
    }
}

function getState(stateName) {
    for(var i = 0; i < states.length; i++)
        if(states[i].stateName == stateName)
            return states[i];
}

function reverse(s){
    return s.split("").reverse().join("");
}

function acceptsString(testString) {

    var newTestString = reverse(testString);

    var lastState = transitionFunction(states[0], newTestString);

    if(lastState!=null){
        if(lastState.stateType == "F" || lastState.stateType == "IF")
            alert("String was accepted :D");
        else
            alert("The string was NOT accepted :(");
    }else {
        alert("The string was NOT accepted :(");
    }

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

    if(nextState[0] != null){
        console.log("           returns state name: " + nextState[0].stateName);
        console.log("           returns state type: " + nextState[0].stateType);
        return nextState[0];
    }

    return null;

}

function init() {
    var container = document.getElementById('myDiagramDiv');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {};
    network = new vis.Network(container, data, options);
}

function getNextState(state, transitionChar) {

    var nextStates = [];
    for(var i = 0; i< transitions.length; i++){

        if(transitions[i].originState.stateName == state.stateName && transitions[i].transitionChar == transitionChar){
            var nextState = transitions[i].nextState;
            nextStates.push(nextState);
        }
    }
    return nextStates;
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

//endregion


//region NFA

var nodeIdsNfa, nodesNfa, edgesNfa, networkNfa;

var statesNfa = [];

var transitionsNfa = [];

nodeIdsNfa = [];
edgesNfa = [];
nodesNfa = new vis.DataSet();

function createNewStateNfa() {

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

    if(shiftKey || ctrlKey || altKey){

        var stateName = prompt("State name", "State");

        if(stateName != null){
            if(shiftKey && ctrlKey)
                createStateNfa(stateName,"IF", "#00ff99"); //INITIAL FINAL
            else if(shiftKey)
                createStateNfa(stateName,"F", "#00ff99"); //FINAL SHIFT
            else if(ctrlKey)
                createStateNfa(stateName,"I", "#66a3ff"); //INITIAL CONTROL
            else if(altKey)
                createStateNfa(stateName,"N", "#808080"); //NORMAL ALT
        }
    }
}

function createStateNfa(stateName, stateType, colorType) {

    if(!stateExistNfa(stateName)){
        var stateId = (Math.random() * 1e7).toString(32);
        var newState = new State(stateName, stateType, stateId);
        statesNfa.push(newState);
        addNodeNfa(stateId,stateName, colorType);
        callSnackbar("State " + newState.stateName + " created");
    }else
        callSnackbar("State " + stateName + " already exists...");
}

function createNewTransitionNfa() {

    var transitionData = prompt("Transition", "0,a,b");

    if(transitionData != null){
        var dataArray = transitionData.split(",");
        var originState = getStateNfa(dataArray[1]);
        var nextState = getStateNfa(dataArray[2]);

        createTransitionNfa(dataArray[0], originState, nextState);
    }
}

function createTransitionNfa(transitionChar, originState, nextState)       {

    if(originState != null &&  nextState != null){
        transitionsNfa.push(new Transition(transitionChar, originState, nextState));
        createEdgeNfa(transitionChar, originState, nextState);
        callSnackbar("Char: " + transitionChar + " Origin: " + originState.stateName + " Next: " + nextState.stateName);
    }else{
        callSnackbar("Invalid input");
    }
}

function addNodeNfa(stateId, stateName, color) {
    nodesNfa.add({id:stateId, label:stateName, color: {background:color, border:'black'}});
    nodeIdsNfa.push(stateId);
    initNfa();
}

function createEdgeNfa(transitionChar, originState, nextState) {

    var transitionId = (Math.random() * 1e7).toString(32);
    edgesNfa.push({
        id: transitionId,
        from: originState.stateId,
        to: nextState.stateId,
        label: transitionChar,
        color:{color:'rgba(30,30,30,0.2)', highlight:'blue'},
        arrows:'to'
    });

    initNfa();
}

function initNfa() {
    var container = document.getElementById('myNfaDiagramDiv');
    var data = {
        nodes: nodesNfa,
        edges: edgesNfa
    };
    var options = {};
    networkNfa = new vis.Network(container, data, options);
}

function getStateNfa(stateName) {
    for(var i = 0; i < statesNfa.length; i++)
        if(statesNfa[i].stateName == stateName)
            return statesNfa[i];
}

function acceptsStringNfa(testString) {

    var accepts = false;
    var lastStates = transitionFunctionNfa(statesNfa[0], testString);

//    for(var  i = 0; i < lastStates.length; i++)
        if(lastStates == "F" || lastStates == "IF" )
            accepts = true;

    if(accepts)
        alert("String was accepted :D");
    else
        alert("The string was NOT accepted :(");

}

function transitionFunctionNfa(initialState, testString){

    var lastStates;
    var returnStates;
    var testChar =  testString.charAt(0);

    if(testString > 1){
        var newTestString =  testString.slice(1,testString.length);
        lastStates = extendedFunctionTransitionNfa(transitionFunctionNfa(initialState, newTestString), testChar);

        for(var i = 0; i < lastStates.length; i++){
            returnStates = transitionFunctionNfa(lastStates[i], newTestString);
        }

    }else{
        lastStates = extendedFunctionTransition(initialState, testChar);
        for(var j = 0; j < lastStates.length; j++){
            returnStates = transitionFunctionNfa(lastStates[j], testChar);
        }
    }

    return returnStates;

}

function extendedFunctionTransitionNfa(state, testChar) {

    var nextStates = getNextStatesNfa(state, testChar);

    if(nextStates != null){
        return nextStates;
    }

    return null;
}

function getNextStatesNfa(state, transitionChar){

    var nextStates = [];
    for(var i = 0; i< transitionsNfa.length; i++){

        if(transitionsNfa[i].originState.stateName == state.stateName && transitionsNfa[i].transitionChar == transitionChar){

            var nextState = transitionsNfa[i].nextState;
            nextStates.push(nextState);
        }
    }

    return nextStates;
}


function stateExistNfa(stateName) {
    for(var i = 0; i < statesNfa.length; i++)
        if(statesNfa[i].stateName == stateName)
            return true;

    return false;
}


//endregion


//region Global Functions

function callSnackbar(displayText) {
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

//endregion