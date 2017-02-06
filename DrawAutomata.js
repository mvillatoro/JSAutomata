/**
 * Created by mvill on 1/27/2017.
 */


var nodeIds, nodes, edges, network;

var states = [];

var transitions = [];

nodeIds = [];
edges = [];
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

    if(!stateExist(stateName)){
        var stateId = (Math.random() * 1e7).toString(32);
        var newState = new State(stateName, stateType, stateId);
        states.push(newState);
        addNode(stateId,stateName, colorType);
        callSnackbar("State " + newState.stateName + " created");
    }else
        callSnackbar("State " + stateName + " already exists...");
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

function createTransition(transitionChar, originState, nextState)   {

    console.log(transitionChar);
    console.log(originState);
    console.log(nextState);

    if(originState != null &&  nextState != null){
            transitions.push(new Transition(transitionChar, originState, nextState));
            createEdge(transitionChar, originState, nextState);
            callSnackbar("Char: " + transitionChar + " Origin: " + originState.stateName + " Next: " + nextState.stateName);
    }else{
        callSnackbar("Invalid input");
    }
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

//endregion

function acceptsString(testString) {

    console.log("Begin accept string {");
    console.log("   initial state: " + states[0].stateName);
    console.log("   state type: " + states[0].stateType);
    console.log("   test string: " + testString);

    var lastState = transitionFunction(states[0], testString);

    if(lastState!=null){
        if(lastState.stateType == "F" || lastState.stateType == "IF")
            alert("String was accepted :D");
        else
            alert("The string was NOT accepted :(");
    }else {
        alert("The string was NOT accepted :(");
    }

    console.log("}End accept string");

}

function transitionFunction(initialState, testString) {

    console.log("   Begin trans func{");
    console.log("        initial state: " + initialState.stateName);
    console.log("        state type: " + initialState.stateType);
    console.log("        test string: " + testString);

    var testChar = testString.charAt(0);

    console.log("        test 1st char: " + testChar);

    var lastState;
    if (testString.length > 1) {
        var newTestString =  testString.slice(1,testString.length);
        console.log("       test 1st if new test string: " + newTestString);

        lastState = extendedFunctionTransition(transitionFunction(initialState, newTestString), testChar);

    }else
    {
        console.log("        test 2st if new test char: " + testChar);

        lastState =extendedFunctionTransition(initialState, testChar);
    }

    console.log("       }End trans func");

    return lastState;
}

function extendedFunctionTransition(state, testChar) {

    console.log("           Begin ext func{");

    console.log("               test char: " + testChar);

    console.log("               state name: " + state.stateName);
    console.log("               state type: " + state.stateType);

    var nextState = getNextState(state, testChar);

    console.log("               next state: " + nextState[0].stateName);

    if(nextState[0]!= null){
        console.log("           returns state name: " + nextState[0].stateName);
        console.log("           returns state type: " + nextState[0].stateType);
        return nextState[0];
    }

    console.log("           }End ext func");
    return null;

}

function getNextState(state, transitionChar) {

    console.log("               Begin get next state{");

    console.log("                   state name: " + state.stateName);

    console.log("                   transitions length: " + transitions.length);

    var nextStates = [];
    for(var i = 0; i< transitions.length; i++){

        console.log("                   Transition " + i + " origin state :" + transitions[i].originState.stateName);
        console.log("                   Transition " + i + " next state :" + transitions[i].nextState.stateName);
        console.log("                   Transition " + i + " char trans :" + transitions[i].transitionChar);

        if(transitions[i].originState.stateName == state.stateName && transitions[i].transitionChar == transitionChar){

            console.log("                   transition match");

            // if(transitions[i].nextState != null){

            // console.log("State exists");
            var nextState = transitions[i].nextState;
            nextStates.push(nextState);
            //}
        }
    }

    //console.log("                   return next states: " + nextState.stateName);

    console.log("               }End get next state");

    return nextStates;
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

function getState(stateName) {
    for(var i = 0; i < states.length; i++){
        if(states[i].stateName == stateName){
            return states[i];
        }
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

    for (var i = 0; i < states.length; i++) {
        console.log("State name: " + states[i].stateName);
        console.log("State type: " + states[i].stateType);
    }
}

function printTransitions() {
    for(var i = 0; i < transitions.length; i++){
        console.log(transitions[i].transitionChar);
        console.log(transitions[i].originState);
        console.log(transitions[i].nextState);
    }
}